import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import { Col, Container, Row, Tab, Table, Tabs, Title } from '@dataesr/react-dsfr';
import AppBreadcrumb from '../../components/AppBreadcrumb/AppBreadcrumb';
import { fetchEstablishmentData, fetchHousingByStatusCount } from '../../store/actions/monitoringAction';
import { EstablishmentData } from '../../models/Establishment';
import { differenceInDays, format, formatDuration } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    ExitWithoutSupportSubStatus,
    ExitWithPublicSupportSubStatus,
    ExitWithSupportSubStatus,
    FirstContactToContactedSubStatus,
    FirstContactWithPreSupportSubStatus,
    HousingStatus,
    InProgressWithoutSupportSubStatus,
    InProgressWithPublicSupportSubStatus,
    InProgressWithSupportSubStatus,
} from '../../models/HousingState';
import AppMultiSelect from '../../components/AppMultiSelect/AppMultiSelect';
import { useAvailableEstablishmentOptions } from '../../hooks/useAvailableEstablishmentOptions';
import FilterBadges from '../../components/FiltersBadges/FiltersBadges';
import { MonitoringFilters } from '../../models/MonitoringFilters';
import { dataYearsIncludedOptions } from '../../models/HousingFilters';


const MonitoringView = () => {

    const dispatch = useDispatch();
    const availableEstablishmentOptions = useAvailableEstablishmentOptions();

    const { establishmentData, housingByStatus, housingByStatusFilters } = useSelector((state: ApplicationState) => state.monitoring);
    const [monitoringFilters, setMonitoringFilters] = useState<MonitoringFilters>({})

    useEffect(() => {
        dispatch(fetchEstablishmentData({ ...housingByStatusFilters, ...monitoringFilters }))
        dispatch(fetchHousingByStatusCount({ ...housingByStatusFilters, ...monitoringFilters }))
    }, [dispatch, monitoringFilters])

    const establishmentColumn = {
        name: 'establishment',
        label: 'Collectivité',
        render: ({ name }: EstablishmentData) =>
            <>
                {name}
            </>
    };

    const housingCountColumn = {
        name: 'housingCount',
        label: 'Nombre de logements vacants',
        render: ({ housingCount }: EstablishmentData) =>
            <>
                {housingCount}
            </>
    };

    const firstActivationColumn = {
        name: 'firstActivation',
        label: 'Date de première inscription',
        render: ({ firstActivatedAt }: EstablishmentData) => <>
            { firstActivatedAt && <>
                {format(firstActivatedAt, 'dd/MM/yyyy')} <br />({differenceInDays(new Date(), firstActivatedAt)} jours)
            </> }
        </>
    };

    const lastAuthenticationColumn = {
        name: 'lastAuthentication',
        label: 'Date de dernière connexion',
        render: ({ lastAuthenticatedAt }: EstablishmentData) => <>
            { lastAuthenticatedAt && <>
                {format(lastAuthenticatedAt, 'dd/MM/yyyy')}
            </> }
        </>
    };

    const lastMonthUpdatesCountColumn = {
        name: 'lastMonthUpdatesCount',
        label: 'Nombre de dossiers mis à jour dans les 30 derniers jours',
        render: ({ lastMonthUpdatesCount }: EstablishmentData) => <>
            {lastMonthUpdatesCount}
        </>
    };

    const campaignsCountColumn = {
        name: 'campaignsCount',
        label: 'Nombre de campagnes',
        render: ({ campaignsCount }: EstablishmentData) => <>
            {campaignsCount}
        </>
    };

    const contactedHousingCountColumn = {
        name: 'contactedHousingCount',
        label: 'Nombre de logements contactés',
        render: ({ housingCount, contactedHousingCount }: EstablishmentData) => <>
            {contactedHousingCount} ({Math.floor(contactedHousingCount / housingCount * 100)}%)
        </>
    };

    const contactedHousingPerCampaignColumn = {
        name: 'contactedHousingPerCampaign',
        label: 'Nombre de logements contactés par campagne',
        render: ({ housingCount, contactedHousingPerCampaign }: EstablishmentData) => <>
            {Math.floor(contactedHousingPerCampaign)} ({Math.floor(contactedHousingPerCampaign / housingCount * 100)}%)
        </>
    };

    const lastCampaignSentAtColumn = {
        name: 'lastCampaign',
        label: 'Date d\'envoi de la dernière campagne',
        render: ({ lastCampaignSentAt }: EstablishmentData) => <>
            { lastCampaignSentAt && <>
                {format(lastCampaignSentAt, 'dd/MM/yyyy')} <br />({differenceInDays(new Date(), lastCampaignSentAt)} jours)
            </> }
        </>
    };

    const delayBetweenCampaignsColumn = {
        name: 'delayBetweenCampaigns',
        label: 'Temps moyen d’envoi entre 2 campagnes',
        render: ({ delayBetweenCampaigns }: EstablishmentData) => <>
            {delayBetweenCampaigns && <>
                {formatDuration(delayBetweenCampaigns, { format: ['months', 'days'], locale: fr }) }
            </>}
        </>
    };

    const firstCampaignSentAtColumn = {
        name: 'firstCampaign',
        label: 'Temps d\'envoi de la première campagne après inscription',
        render: ({ firstCampaignSentAt, firstActivatedAt }: EstablishmentData) => <>
            { firstActivatedAt && firstCampaignSentAt && <>
                {differenceInDays(firstCampaignSentAt, firstActivatedAt)} jours
            </> }
        </>
    };

    const housingWithStatusCount = (status: HousingStatus, subStatus?: string) => {
        return housingByStatus?.filter(_ => _.status === status)
            .filter(_ => subStatus ? _.subStatus === subStatus : true)
            .reduce((count, h) => Number(h.count) + count, 0)
    }

    const housingWithStatusNoPrecisionsCount = (status?: HousingStatus) => {
        return housingByStatus?.filter(_ => status ? _.status === status : true)
            .filter(_ => !_.precisions?.length)
            .reduce((count, h) => Number(h.count) + count, 0)
    }

    const housingWithStatusPrecisions = (status: HousingStatus, subStatus: string) => {
        return housingByStatus?.filter(_ => _.status === status)
            .filter(_ => _.subStatus === subStatus)
            .reduce((acc, value) => [...acc, ...(value.precisions ?? [])
                .filter(_ => _?.length)
                .map(_ => ({ precision:_, count: value.count}))], [] as { precision: string, count: number }[]
            )
            .reduce((acc, value) => {
                const found = acc.find(_ => _.precision === value.precision);
                if (!found) {
                    acc.push(value)
                } else {
                    found.count = Number(found.count) + Number(value.count)
                }
                return acc;
            }, [] as { precision: string, count: number }[])
            .map((_, index) =>
                <Row key={status + "_" + subStatus + "_" + index}>
                    <Col>
                        {_.precision} :&nbsp;{_.count}
                    </Col>
                </Row>
            )
    }

    const columns = () => [
        establishmentColumn,
        housingCountColumn,
        firstActivationColumn,
        lastAuthenticationColumn,
        lastMonthUpdatesCountColumn,
        campaignsCountColumn,
        contactedHousingCountColumn,
        contactedHousingPerCampaignColumn,
        lastCampaignSentAtColumn,
        delayBetweenCampaignsColumn,
        firstCampaignSentAtColumn
    ]

    return (

        <>
            <div className="bg-100">
                <Container spacing="pb-1w">
                    <AppBreadcrumb />
                    <Row gutters>
                        <Col n="6">
                            <Title as="h1">Suivi</Title>
                        </Col>
                        <Col n="4">
                            <AppMultiSelect label="Etablissements"
                                            options={availableEstablishmentOptions}
                                            initialValues={housingByStatusFilters.establishmentIds}
                                            onChange={(values) => setMonitoringFilters({...monitoringFilters, establishmentIds: values})}/>
                        </Col>
                        <Col n="2">
                            <AppMultiSelect label="Millésimes"
                                            options={dataYearsIncludedOptions}
                                            initialValues={(housingByStatusFilters.dataYears ?? []).map(_ => String(_))}
                                            onChange={(values) => setMonitoringFilters({...monitoringFilters, dataYears: values.map(_ => Number(_))})}/>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container spacing="pt-2w">
                <Row className="fr-pb-2w">
                    <FilterBadges filters={housingByStatusFilters.establishmentIds}
                                  options={availableEstablishmentOptions}
                                  onChange={(values) => setMonitoringFilters({...monitoringFilters, establishmentIds: values})}/>
                    <FilterBadges filters={(housingByStatusFilters.dataYears ?? []).map(_ => String(_))}
                                  options={dataYearsIncludedOptions}
                                  onChange={(values) => setMonitoringFilters({...monitoringFilters, dataYears: values.map(_ => Number(_))})}/>
                </Row>
                <Tabs>
                    <Tab label="Suivi général">
                        <Row className="bordered-b fr-py-1w">
                            <Col n="4">
                                <b>En attente de retour</b> :&nbsp;
                                {housingByStatus ? housingWithStatusCount(HousingStatus.Waiting) : '...'}
                            </Col>
                        </Row>
                        <Row className="bordered-b fr-py-1w">
                            <Col n="4">
                                <b>Premier contact</b> :&nbsp;
                                {housingByStatus ? housingWithStatusCount(HousingStatus.FirstContact) : '...'}
                            </Col>
                            <Col>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{FirstContactToContactedSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.FirstContact, FirstContactToContactedSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.FirstContact, FirstContactToContactedSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{FirstContactWithPreSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.FirstContact, FirstContactWithPreSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.FirstContact, FirstContactWithPreSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="fr-py-1w">
                                    <Col>
                                        <b>Sans précisions</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusNoPrecisionsCount(HousingStatus.FirstContact) : '...'}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="bordered-b fr-py-1w">
                            <Col n="4">
                                <b>Suivi en cours</b> :&nbsp;
                                {housingByStatus ? housingWithStatusCount(HousingStatus.InProgress) : '...'}
                            </Col>
                            <Col>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{InProgressWithSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.InProgress, InProgressWithSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.InProgress, InProgressWithSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{InProgressWithPublicSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.InProgress, InProgressWithPublicSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.InProgress, InProgressWithPublicSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{InProgressWithoutSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.InProgress, InProgressWithoutSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.InProgress, InProgressWithoutSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="fr-py-1w">
                                    <Col>
                                        <b>Sans précisions</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusNoPrecisionsCount(HousingStatus.InProgress) : '...'}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="bordered-b fr-py-1w">
                            <Col n="4">
                                <b>Sortie de la vacance</b> :&nbsp;
                                {housingByStatus ? housingWithStatusCount(HousingStatus.Exit) : '...'}
                            </Col>
                            <Col>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{ExitWithSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.Exit, ExitWithSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.Exit, ExitWithSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{ExitWithPublicSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.Exit, ExitWithPublicSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.Exit, ExitWithPublicSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="bordered-b fr-py-1w">
                                    <Col>
                                        <b>{ExitWithoutSupportSubStatus}</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusCount(HousingStatus.Exit, ExitWithoutSupportSubStatus) : '...'}
                                    </Col>
                                    <Col>
                                        {housingWithStatusPrecisions(HousingStatus.Exit, ExitWithoutSupportSubStatus)}
                                    </Col>
                                </Row>
                                <Row className="fr-py-1w">
                                    <Col>
                                        <b>Sans précisions</b> :&nbsp;
                                        {housingByStatus ? housingWithStatusNoPrecisionsCount(HousingStatus.Exit) : '...'}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="fr-py-1w">
                            <Col n="4">
                                <b>Nombre de logements sans précisions</b> :&nbsp;
                                {housingByStatus ? housingWithStatusNoPrecisionsCount() : '...'}
                            </Col>
                        </Row>
                    </Tab>
                    <Tab label="Suivi comparatif">
                        {establishmentData &&
                            <Table
                                caption="Collectivités"
                                captionPosition="none"
                                rowKey="id"
                                data={establishmentData}
                                columns={columns()}
                                fixedLayout={false}
                            />
                        }
                    </Tab>
                </Tabs>
            </Container>
        </>
    )
}

export default MonitoringView;
