import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import AppBreadcrumb from '../../components/AppBreadcrumb/AppBreadcrumb';
import { fetchEstablishmentData } from '../../store/actions/monitoringAction';
import { EstablishmentData } from '../../models/Establishment';
import { differenceInDays, format, formatDuration } from 'date-fns';
import { fr } from 'date-fns/locale';
import { percent } from '../../utils/numberUtils';
import { useParams } from 'react-router-dom';

const MonitoringView = () => {

    const dispatch = useDispatch();

    const { establishmentId } = useParams<{establishmentId: string}>();

    const { establishmentData } = useSelector((state: ApplicationState) => state.monitoring);
    const [ establishmentDetailData, setEstablishmentDetailData] = useState<EstablishmentData>()


    useEffect(() => {
        if (!establishmentData) {
            dispatch(fetchEstablishmentData({ establishmentIds: [establishmentId] }))
        }
    }, [dispatch])

    useEffect(() => {
        if (establishmentData) {
            setEstablishmentDetailData(establishmentData.find(_ => _.id === establishmentId))
        }
    }, [establishmentId, establishmentData])

    return (

        <>
            <div className="bg-100">
                <Container spacing="pb-1w">
                    <AppBreadcrumb />
                    <Row gutters>
                        <Col>
                            <Title as="h1">{establishmentDetailData?.name ?? ''}</Title>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container spacing="pt-2w">
                <ul>
                    <li>
                        <b>Nombre de logements vacants :&nbsp;</b>
                        {establishmentDetailData?.housingCount}
                    </li>
                    <li>
                        <b>Date de première inscription :&nbsp;</b>
                            { establishmentDetailData?.firstActivatedAt && <>
                                {format(establishmentDetailData.firstActivatedAt, 'dd/MM/yyyy')} ({differenceInDays(new Date(), establishmentDetailData?.firstActivatedAt)} jours)
                            </> }
                    </li>
                    <li>
                        <b>Date de dernière connexion :&nbsp;</b>
                            { establishmentDetailData?.lastAuthenticatedAt && <>
                                {format(establishmentDetailData?.lastAuthenticatedAt, 'dd/MM/yyyy')}
                            </> }
                    </li>
                    <li>
                        <b>Nombre de dossiers mis à jour dans les 30 derniers jours :&nbsp;</b>
                        {establishmentDetailData?.lastMonthUpdatesCount}
                    </li>
                    <li>
                        <b>Nombre de campagnes :&nbsp;</b>
                        {establishmentDetailData?.campaignsCount}
                    </li>
                    <li>
                        <b>Nombre de logements contactés :&nbsp;</b>
                        {establishmentDetailData?.contactedHousingCount} ({percent(establishmentDetailData?.contactedHousingCount, establishmentDetailData?.housingCount)}%)
                    </li>
                    <li>
                        <b>Nombre de logements contactés par campagne :&nbsp;</b>
                        {Math.floor(establishmentDetailData?.contactedHousingPerCampaign ?? 0)} ({percent(establishmentDetailData?.contactedHousingPerCampaign, establishmentDetailData?.housingCount)}%)
                    </li>
                    <li>
                        <b>Date d'envoi de la dernière campagne :&nbsp;</b>
                        {establishmentDetailData?.lastCampaignSentAt && <>
                            {format(establishmentDetailData?.lastCampaignSentAt, 'dd/MM/yyyy')} ({differenceInDays(new Date(), establishmentDetailData?.lastCampaignSentAt)} jours)
                        </>}
                    </li>
                    <li>
                        <b>Temps moyen d’envoi entre 2 campagnes :&nbsp;</b>
                        {establishmentDetailData?.delayBetweenCampaigns && <>
                            {formatDuration(establishmentDetailData?.delayBetweenCampaigns, { format: ['months', 'days'], locale: fr }) }
                        </>}
                    </li>
                    <li>
                        <b>Temps d'envoi de la première campagne après inscription :&nbsp;</b>
                        { establishmentDetailData?.firstActivatedAt && establishmentDetailData?.firstCampaignSentAt && <>
                            {differenceInDays(establishmentDetailData?.firstCampaignSentAt, establishmentDetailData?.firstActivatedAt)} jours
                        </> }
                    </li>
                </ul>
            </Container>
        </>
    )
}

export default MonitoringView;
