import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Text } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeCampaignHousingPagination,
    listCampaignHousing,
    removeCampaignHousingList, updateCampaignHousingList,
} from '../../store/actions/campaignAction';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import HousingList, { HousingDisplayKey } from '../../components/HousingList/HousingList';
import { CampaignHousing, CampaignHousingUpdate, SelectedHousing, selectedHousingCount } from '../../models/Housing';
import AppActionsMenu, { MenuAction } from '../../components/AppActionsMenu/AppActionsMenu';
import CampaignHousingStatusModal
    from '../../components/modals/CampaignHousingStatusModal/CampaignHousingStatusModal';
import {
    CampaignHousingStatus, getPrecision,
    getCampaignHousingState,
    getStep,
} from '../../models/CampaignHousingState';
import { displayCount } from '../../utils/stringUtils';
import ConfirmationModal from '../../components/modals/ConfirmationModal/ConfirmationModal';
import CampaignHousingListStatusModal
    from '../../components/modals/CampaignHousingStatusModal/CampaignHousingListStatusModal';

const TabContent = ({ status } : { status: CampaignHousingStatus }) => {

    const dispatch = useDispatch();

    const [selectedHousing, setSelectedHousing] = useState<SelectedHousing>({all: false, ids: []});
    const [updatingModalCampaignHousing, setUpdatingModalCampaignHousing] = useState<CampaignHousing | undefined>();
    const [updatingModalSelectedHousing, setUpdatingModalSelectedHousing] = useState<SelectedHousing | undefined>();
    const [isRemovingModalOpen, setIsRemovingModalOpen] = useState<boolean>(false);

    const { campaignHousingByStatus, campaign } = useSelector((state: ApplicationState) => state.campaign);

    if (!campaign) {
        return <></>
    }

    const paginatedCampaignHousing = campaignHousingByStatus[status];

    const selectedCount = selectedHousingCount(selectedHousing, paginatedCampaignHousing.totalCount)

    const menuActions = [
        { title: 'Changer le statut', selectedHousing, onClick: () => setUpdatingModalSelectedHousing(selectedHousing) },
        { title: 'Supprimer', selectedHousing, onClick: () => setIsRemovingModalOpen(true)}
    ] as MenuAction[]

    const modifyColumn = {
        name: 'modify',
        headerRender: () => '',
        render: (campaignHousing: CampaignHousing) =>
            <>
                <Button title="Mettre à jour"
                        size="sm"
                        secondary
                        onClick={() => setUpdatingModalCampaignHousing(campaignHousing)}>
                    Mettre à jour &nbsp;<span className="fr-fi-edit-fill" aria-hidden="true" />
                </Button>
            </>
    }

    const statusColumn = {
        name: 'status',
        label: 'Statut',
        render: ({ status, step, precision } : CampaignHousing) =>
            <>
                <div style={{
                    backgroundColor: `var(${getCampaignHousingState(status).bgcolor})`,
                    color: `var(${getCampaignHousingState(status).color})`,
                }}
                     className='status-label'>
                    {getCampaignHousingState(status).title}
                </div>
                {step && step !== getCampaignHousingState(status).title &&
                    <div style={{
                        backgroundColor: `var(${getStep(status, step)?.bgcolor})`,
                        color: `var(${getStep(status, step)?.color})`,
                    }}
                         className='status-label'>
                        {step}
                    </div>
                }
                {step && precision &&
                    <div style={{
                        backgroundColor: `var(${getPrecision(status, step, precision)?.bgcolor})`,
                        color: `var(${getPrecision(status, step, precision)?.color})`,
                    }}
                          className='status-label'>
                                {precision}
                            </div>
                }
            </>
    };

    const submitCampaignHousingUpdate = (campaignHousing: CampaignHousing, campaignHousingUpdate: CampaignHousingUpdate) => {
        dispatch(updateCampaignHousingList(campaignHousing.campaignId, campaignHousingUpdate, false, [campaignHousing.id]))
        setUpdatingModalCampaignHousing(undefined)
    }

    const submitSelectedHousingUpdate = (updated: CampaignHousingUpdate) => {
        dispatch(updateCampaignHousingList(campaign.id, updated, selectedHousing.all, selectedHousing.ids))
        setUpdatingModalSelectedHousing(undefined);
    }

    return (
        <>
            {!paginatedCampaignHousing.loading && <>
                <b>{displayCount(paginatedCampaignHousing.totalCount, 'logement')}</b>
                {paginatedCampaignHousing.totalCount > 0 &&
                    <AppActionsMenu actions={menuActions}/>
                }
                <HousingList paginatedHousing={paginatedCampaignHousing}
                             onChangePagination={(page, perPage) => dispatch(changeCampaignHousingPagination(page, perPage, status))}
                             displayKind={HousingDisplayKey.Owner}
                             onSelectHousing={(selectedHousing: SelectedHousing) => setSelectedHousing(selectedHousing)}
                             additionalColumns={[statusColumn, modifyColumn]}
                             tableClassName="campaign"/>
                {updatingModalCampaignHousing &&
                    <CampaignHousingStatusModal
                        housingList={[updatingModalCampaignHousing]}
                        campaignHousingList={[updatingModalCampaignHousing]}
                        onSubmit={submitCampaignHousingUpdate}
                        onClose={() => setUpdatingModalCampaignHousing(undefined)}/>
                }
                {updatingModalSelectedHousing &&
                    <CampaignHousingListStatusModal
                        housingCount={selectedCount}
                        initialStatus={status}
                        onSubmit={campaignHousingUpdate => submitSelectedHousingUpdate(campaignHousingUpdate)}
                        onClose={() => setUpdatingModalSelectedHousing(undefined)}/>
                }
                {isRemovingModalOpen &&
                    <ConfirmationModal
                        onSubmit={() => {
                            dispatch(removeCampaignHousingList(campaign.id, selectedHousing.all, selectedHousing.ids, status))
                            setIsRemovingModalOpen(false);
                        }}
                        onClose={() => setIsRemovingModalOpen(false)}>
                        <Text size="md" className="fr-mb-0">
                            Êtes-vous sûr de vouloir supprimer {selectedCount === 1 ? 'ce logement' : `ces ${selectedCount} logements de cette campagne`} ?
                        </Text>
                    </ConfirmationModal>
                }
            </>}
        </>
    )
}



const CampaignInProgress = () => {

    const dispatch = useDispatch();

    const { campaignHousingByStatus, campaign } = useSelector((state: ApplicationState) => state.campaign);

    useEffect(() => {
        if (campaign) {
            dispatch(listCampaignHousing(campaign.id, CampaignHousingStatus.Waiting))
            dispatch(listCampaignHousing(campaign.id, CampaignHousingStatus.InProgress))
            dispatch(listCampaignHousing(campaign.id, CampaignHousingStatus.NoAction))
            dispatch(listCampaignHousing(campaign.id, CampaignHousingStatus.NotVacant))
            dispatch(listCampaignHousing(campaign.id, CampaignHousingStatus.Exit))
        }
    }, [dispatch])

    const getTabLabel = (status: CampaignHousingStatus) => {
        return `${getCampaignHousingState(status).title} (${campaignHousingByStatus[status].loading ? '...' : campaignHousingByStatus[status].totalCount})`
    }

    return (
        <Tabs>
            <Tab label={getTabLabel(CampaignHousingStatus.Waiting)}>
                <TabContent status={CampaignHousingStatus.Waiting}/>
            </Tab>
            <Tab label={getTabLabel(CampaignHousingStatus.InProgress)}>
                <TabContent status={CampaignHousingStatus.InProgress}/>
            </Tab>
            <Tab label={getTabLabel(CampaignHousingStatus.NotVacant)}>
                <TabContent status={CampaignHousingStatus.NotVacant}/>
            </Tab>
            <Tab label={getTabLabel(CampaignHousingStatus.NoAction)}>
                <TabContent status={CampaignHousingStatus.NoAction}/>
            </Tab>
            <Tab label={getTabLabel(CampaignHousingStatus.Exit)}>
                <TabContent status={CampaignHousingStatus.Exit}/>
            </Tab>
        </Tabs>
    );
};

export default CampaignInProgress;
