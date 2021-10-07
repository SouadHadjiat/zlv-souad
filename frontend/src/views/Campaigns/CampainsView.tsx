import React, { ChangeEvent, useEffect, useState } from 'react';
import { Col, Container, Row, Select, Tab, Tabs, Text, Title } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import { searchCampaign } from '../../store/actions/campaignAction';
import AppSearchBar from '../../components/AppSearchBar/AppSearchBar';
import styles from '../Owner/owner.module.scss';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import { CampaignFilters } from '../../models/Campaign';


const CampaignsView = () => {

    const dispatch = useDispatch();

    const { filters } = useSelector((state: ApplicationState) => state.campaign);
    const [campaignFilters, setCampaignFilters] = useState<CampaignFilters>(filters ?? {});
    const [campaignIdOptions, setCampaignIdOptions] = useState<any[]>([ {value: "", label: "Sélectionner", disabled: true, hidden: true}])

    const { campaignList } = useSelector((state: ApplicationState) => state.campaign);

    useEffect(() => {
        setCampaignIdOptions([
            ...campaignIdOptions,
            ...campaignList.map(c => ({ value: c.id, label: c.name }))
        ])
    }, [campaignList])

    useEffect(() => {
        dispatch(searchCampaign(''));
    }, [dispatch])

    return (
        <>
            <div className={styles.titleContainer}>
                <Container spacing="py-4w">
                    <Row>
                        <Col>
                            <Title as="h1">Campagnes</Title>
                        </Col>
                        <Col>
                            <AppSearchBar onSearch={(input: string) => {dispatch(searchCampaign(input))}} />
                        </Col>
                    </Row>
                    <Row>
                        <Col n="3">
                            <Text size="md" className="fr-mb-1w"><b>Sélection</b></Text>
                            <Select
                                label="Nom de la campagne"
                                options={campaignIdOptions}
                                selected={campaignFilters.campaignId}
                                onChange={(e: ChangeEvent<any>) => setCampaignFilters({...campaignFilters, campaignId: e.target.value})}
                                value={campaignFilters.campaignId}
                            />
                        </Col>
                        <Col>
                            <Text size="md" className="fr-mb-1w"><b>Caractéristiques de la campagne</b></Text>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container spacing="py-4w">
                <Tabs>
                    <Tab label="À contacter">
                    </Tab>
                    <Tab label="En attente de retour">
                    </Tab>
                    <Tab label="Suivi en cours">
                    </Tab>
                    <Tab label="Sans suite">
                    </Tab>
                    <Tab label="Remis sur le marché">
                    </Tab>
                </Tabs>
            </Container>
        </>
    );
};

export default CampaignsView;

