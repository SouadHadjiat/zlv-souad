import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Row, TextInput } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeCampaignHousingPagination,
    listCampaignBundleHousing,
    removeCampaignHousingList,
    validCampaignStep,
} from '../../store/actions/campaignAction';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import { CampaignSteps } from '../../models/Campaign';
import styles from './campaign.module.scss';
import classNames from 'classnames';
import HousingList, { HousingDisplayKey } from '../../components/HousingList/HousingList';
import { format, isDate, parse } from 'date-fns';
import * as yup from 'yup';
import { ValidationError } from 'yup/es';
import { SelectedHousing, selectedHousingCount } from '../../models/Housing';
import { HousingStatus } from '../../models/HousingState';
import AppActionsMenu, { MenuAction } from '../../components/AppActionsMenu/AppActionsMenu';
import ConfirmationModal from '../../components/modals/ConfirmationModal/ConfirmationModal';
import CampaignExportModal from '../../components/modals/CampaignExportModal/CampaignExportModal';


const CampaignToValidate = ({campaignStep}: {campaignStep: CampaignSteps}) => {

    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHousing, setSelectedHousing] = useState<SelectedHousing>({all: false, ids: []});
    const [forcedStep, setForcedStep] = useState<CampaignSteps>();
    const [isRemovingModalOpen, setIsRemovingModalOpen] = useState<boolean>(false);

    const [sendingDate, setSendingDate] = useState(format(new Date(), 'dd/MM/yyyy'));
    const [errors, setErrors] = useState<any>({});

    const sendingForm = yup.object().shape({
        sendingDate: yup
            .date()
            .transform((curr, originalValue) => {
                return !originalValue.length ? null : (isDate(originalValue) ? originalValue : parse(originalValue, 'dd/MM/yyyy', new Date()))
            })
            .typeError('Veuillez renseigner une date valide.')
    });

    const { campaignBundle, campaignBundleHousingByStatus, exportURL } = useSelector((state: ApplicationState) => state.campaign);

    useEffect(() => {
        if (campaignBundle) {
            dispatch(listCampaignBundleHousing(campaignBundle, HousingStatus.NotInCampaign))
        }
    }, [dispatch, campaignBundle])

    if (!campaignBundle) {
        return <></>
    }

    const currentStep = (): CampaignSteps => {
        return forcedStep ?? campaignStep
    }

    const validStep = (step: CampaignSteps) => {
        if (step === CampaignSteps.Sending) {
            sendingForm
                .validate({ sendingDate }, {abortEarly: false})
                .then(() => {
                    dispatch(validCampaignStep(campaignBundle.campaignIds[0], step, {sendingDate : sendingDate.length ? parse(sendingDate, 'dd/MM/yyyy', new Date()) : undefined}))
                })
                .catch(err => {
                    const object: any = {};
                    err.inner.forEach((x: ValidationError) => {
                        if (x.path !== undefined && x.errors.length) {
                            object[x.path] = x.errors[0];
                        }
                    });
                    setErrors(object);
                })
        }
        else {
            dispatch(validCampaignStep(campaignBundle.campaignIds[0], step))
        }
    }

    const submitCampaignHousingRemove = () => {
        dispatch(removeCampaignHousingList(campaignBundle.campaignIds[0], selectedHousing.all, selectedHousing.ids, HousingStatus.NotInCampaign))
        setIsRemovingModalOpen(false);
    }

    const selectedCount = (campaignHousingStatus: HousingStatus) => selectedHousingCount(selectedHousing, campaignBundleHousingByStatus[campaignHousingStatus].totalCount)

    const menuActions = [
        { title: 'Supprimer', selectedHousing, onClick: () => setIsRemovingModalOpen(true)}
    ] as MenuAction[]

    return (
        <>
            <div className={classNames(styles.campaignStep,
                currentStep() === CampaignSteps.OwnersValidation ? styles.currentStep :
                    currentStep() > CampaignSteps.OwnersValidation ? styles.oldStep : '')}>
                <div className={styles.stepLabel}>
                    <div>
                        <div className={styles.stepNumber}>1</div>
                    </div>
                    <div>
                        <h2>Création de la liste des propriétaires</h2>
                        <span>Ajoutez ou supprimez des propriétaires de votre campagne.</span>
                    </div>
                    {currentStep() === CampaignSteps.OwnersValidation &&
                    <Button
                        onClick={() => validStep(CampaignSteps.OwnersValidation)}
                        title="Valider"
                        className={styles.stepAction}>
                        Valider
                    </Button>
                    }
                    {currentStep() > CampaignSteps.OwnersValidation &&
                    <div className={classNames(styles.stepAction, styles.success)}>
                        <button
                            className="ds-fr--inline fr-link"
                            type="button"
                            title="Modifier la liste"
                            onClick={() => setForcedStep(CampaignSteps.OwnersValidation)}>
                            Modifier la liste
                        </button>
                        <span className="fr-fi-check-line" aria-hidden="true"/>
                    </div>
                    }
                </div>
                {currentStep() === CampaignSteps.OwnersValidation && !campaignBundleHousingByStatus[HousingStatus.NotInCampaign].loading &&
                    <div className="fr-pt-4w">
                        <AppActionsMenu actions={menuActions}/>
                        <HousingList paginatedHousing={campaignBundleHousingByStatus[HousingStatus.NotInCampaign]}
                                     onChangePagination={(page, perPage) => dispatch(changeCampaignHousingPagination(page, perPage, HousingStatus.NotInCampaign))}
                                     displayKind={HousingDisplayKey.Housing}
                                     onSelectHousing={(selectedHousing: SelectedHousing) => setSelectedHousing(selectedHousing)}/>
                        {isRemovingModalOpen &&
                            <ConfirmationModal
                                onSubmit={() => submitCampaignHousingRemove()}
                                onClose={() => setIsRemovingModalOpen(false)}>
                                Êtes-vous sûr de vouloir supprimer {selectedCount(HousingStatus.NotInCampaign) === 1 ? 'ce logement' : `ces ${selectedCount(HousingStatus.NotInCampaign)} logements`} de cette campagne ?
                            </ConfirmationModal>
                        }
                    </div>
                }
            </div>

            <div className={classNames(styles.campaignStep,
                currentStep() === CampaignSteps.Export ? styles.currentStep :
                    currentStep() > CampaignSteps.Export ? styles.oldStep : '')}>
                <div className={styles.stepLabel}>
                    <div>
                        <div className={styles.stepNumber}>2</div>
                    </div>
                    <div>
                        <h2>Export du fichier de données propriétaires</h2>
                        <span>
                            Ajustez les variables et exportez vos données pour créer votre fichier de publipostage, pour votre envoi email
                            <br/>ou en vue d’une rencontre avec les propriétaires.
                        </span>
                    </div>
                    {currentStep() < CampaignSteps.Export &&
                    <Button
                        disabled
                        title="En attente"
                        className={styles.stepAction}>
                        En attente
                    </Button>
                    }
                    {currentStep() === CampaignSteps.Export &&
                    <>
                        <Button title="Exporter"
                                onClick={() => setIsModalOpen(true)}
                                data-testid="export-campaign-button"
                                className={styles.stepAction}>
                            Exporter
                        </Button>
                        {isModalOpen &&
                        <CampaignExportModal housingCount={campaignBundle.housingCount}
                                             ownerCount={campaignBundle.ownerCount}
                                             exportURL={exportURL}
                                             onSubmit={() => {
                                                 validStep(CampaignSteps.Export);
                                                 setIsModalOpen(false);
                                             }}
                                             onClose={() => setIsModalOpen(false)}/>
                        }
                    </>
                    }
                    {currentStep() > CampaignSteps.Export &&
                    <div className={classNames(styles.stepAction, styles.success)}>
                        <button
                            className="ds-fr--inline fr-link"
                            type="button"
                            title="Modifier"
                            onClick={() => setForcedStep(CampaignSteps.Export)}>
                            Modifier
                        </button>
                        <span className="fr-fi-check-line" aria-hidden="true"/>
                    </div>
                    }
                </div>
            </div>

            <div className={classNames(styles.campaignStep,
                currentStep() === CampaignSteps.Sending ? styles.currentStep :
                    currentStep() > CampaignSteps.Sending ? styles.oldStep : '')}>
                <div className={styles.stepLabel}>
                    <div>
                        <div className={styles.stepNumber}>3</div>
                    </div>
                    <div>
                        <h2>Envoi de la campagne</h2>
                        <span>Datez l’envoi qui marque le début de votre campagne.</span>
                    </div>
                    {currentStep() < CampaignSteps.Sending &&
                    <Button
                        disabled
                        title="En attente"
                        className={styles.stepAction}>
                        En attente
                    </Button>
                    }
                </div>
                {currentStep() === CampaignSteps.Sending &&
                <Row spacing="pt-3w pl-4w ml-4w" className="fr-grid-row--bottom">
                    <Col n="3">
                        <TextInput
                            value={sendingDate}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSendingDate(e.target.value)}
                            label="Date d'envoi"
                            messageType={errors['sendingDate'] ? 'error' : ''}
                            message={errors['sendingDate']}
                        />
                    </Col>
                    <Col>
                        <Button
                            onClick={() => validStep(CampaignSteps.Sending)}
                            title="Valider"
                            className={styles.stepAction}>
                            Confirmer
                        </Button>
                    </Col>
                </Row>
                }
            </div>

            <div className={styles.campaignStep}>
                <div className={styles.stepLabel}>
                    <div>
                        <div className={styles.stepNumber}>4</div>
                    </div>
                    <div>
                        <h2>Suivi de la campagne</h2>
                        <span>Complétez et suivez toutes les interactions avec les propriétaires.</span>
                    </div>
                    <Button
                        disabled
                        title="En attente"
                        className={styles.stepAction}>
                        En attente
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CampaignToValidate;

