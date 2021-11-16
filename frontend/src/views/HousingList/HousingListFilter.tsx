import React, { useEffect, useState } from 'react';

import { Col, Container, Row, Select, Text } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import { filterHousing } from '../../store/actions/housingAction';
import {
    beneficiaryCountOptions,
    constructionPeriodOptions,
    contactsCountOptions,
    housingAreaOptions,
    HousingFilters,
    housingKindOptions,
    housingStateOptions,
    multiOwnerOptions,
    ownerAgeOptions,
    ownerKindOptions,
    vacancyDurationOptions,
} from '../../models/HousingFilters';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import AppMultiSelect from '../../components/AppMultiSelect/AppMultiSelect';

const HousingListFilter = () => {

    const dispatch = useDispatch();

    const { filters } = useSelector((state: ApplicationState) => state.housing);
    const [housingFilters, setHousingFilters] = useState<HousingFilters>(filters ?? {});
    const [expandFilters, setExpandFilters] = useState<boolean>(false);


    const emptyOptions = [
        {value: "", label: "Sélectionner", disabled: true, hidden: true}
    ]

    useEffect(() => {
        dispatch(filterHousing(housingFilters));
    }, [housingFilters, dispatch])

    useEffect(() => {
        setHousingFilters(filters)
    }, [filters])


    const onChangeFilters = (changedFilters: any) => {
        setHousingFilters({
            ...filters,
            ...changedFilters
        })
    }


    return (
        <Container fluid>
            <div data-testid="owner-filters">
                <Text size="md" className="fr-mb-1w fr-mt-4w">
                    <b>Propriétaire</b>
                </Text>
                <Row gutters>
                    <Col n="3">
                        <AppMultiSelect label="Type"
                                        options={ownerKindOptions}
                                        initialValues={filters.ownerKinds}
                                        onChange={(values) => onChangeFilters({ownerKinds: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Âge"
                                        options={ownerAgeOptions}
                                        initialValues={filters.ownerAges}
                                        onChange={(values) => onChangeFilters({ownerAges: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Multi-propriété"
                                        options={multiOwnerOptions}
                                        initialValues={filters.multiOwners}
                                        onChange={(values) => onChangeFilters({multiOwners: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Ayants droit"
                                        options={beneficiaryCountOptions}
                                        initialValues={filters.beneficiaryCounts}
                                        onChange={(values) => onChangeFilters({beneficiaryCounts: values})}/>
                    </Col>
                </Row>
            </div>
            {
            <div id="additional-filters" data-testid="additional-filters" className={expandFilters ? 'fr-collapse--expanded' : 'fr-collapse'}>
                <Text size="md" className="fr-mb-1w fr-mt-4w">
                    <b>Logement</b>
                </Text>
                <Row gutters>
                    <Col n="3">
                        <AppMultiSelect label="Type"
                                        options={housingKindOptions}
                                        initialValues={filters.housingKinds}
                                        onChange={(values) => onChangeFilters({housingKinds: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Surface"
                                        options={housingAreaOptions}
                                        initialValues={filters.housingAreas}
                                        onChange={(values) => onChangeFilters({housingAreas: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="État"
                                        options={housingStateOptions}
                                        initialValues={filters.housingStates}
                                        onChange={(values) => onChangeFilters({housingStates: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Date de construction"
                                        options={constructionPeriodOptions}
                                        initialValues={filters.constructionPeriods}
                                        onChange={(values) => onChangeFilters({constructionPeriods: values})}/>
                    </Col>
                    <Col n="3">
                        <AppMultiSelect label="Durée de vacance"
                                        options={vacancyDurationOptions}
                                        initialValues={filters.vacancyDurations}
                                        onChange={(values) => onChangeFilters({vacancyDurations: values})}/>
                    </Col>
                    <Col n="3">
                        <Select
                            label="Taxe"
                            options={emptyOptions}
                            selected=""
                            onChange={() => {}}
                        />
                    </Col>
                </Row>
                <Text size="md" className="fr-mb-1w fr-mt-4w">
                    <b>Emplacement</b>
                </Text>
                <Row gutters>
                    <Col n="3">
                        <Select
                            label="Commune"
                            options={emptyOptions}
                            selected=""
                            onChange={() => {}}
                        />
                    </Col>
                    <Col n="3">
                        <Select
                            label="Périmètre"
                            options={emptyOptions}
                            selected=""
                            onChange={() => {}}
                        />
                    </Col>
                </Row>
                <Text size="md" className="fr-mb-1w fr-mt-4w">
                    <b>Campagnes</b>
                </Text>
                <Row gutters>
                    <Col n="3">
                        <AppMultiSelect label="Prise de contact"
                                        options={contactsCountOptions}
                                        initialValues={filters.contactsCounts}
                                        onChange={(values) => onChangeFilters({contactsCounts: values})}/>
                    </Col>
                    <Col n="3">
                        <Select
                            label="Périmètre"
                            options={emptyOptions}
                            selected=""
                            onChange={() => {}}
                        />
                    </Col>
                </Row>
            </div>
            }
            <Row gutters>
                <Col>
                    <button
                        className="ds-fr--inline fr-link float-right fr-mt-4w"
                        type="button"
                        aria-controls="additional-filters"
                        aria-expanded={expandFilters}
                        onClick={() => setExpandFilters(!expandFilters)}
                        data-testid="additional-filters-button"
                    >
                        {expandFilters
                            ? <><span className="ri-1x icon-left ri-subtract-line ds-fr--v-middle" />Afficher moins de filtres</>
                            : <><span className="ri-1x icon-left ri-add-line ds-fr--v-middle" />Afficher tous les filtres</>
                        }
                    </button>
                </Col>
            </Row>
        </Container>
    );
};

export default HousingListFilter;
