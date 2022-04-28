import React from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import {
    beneficiaryCountOptions,
    buildingPeriodOptions,
    campaignsCountOptions,
    dataYearsOptions,
    housingAreaOptions,
    housingCountOptions,
    HousingFilters,
    housingKindOptions,
    housingStateOptions,
    localityKindsOptions,
    multiOwnerOptions,
    outOfScopeOption,
    ownerAgeOptions,
    ownerKindOptions,
    ownershipKindsOptions,
    roomsCountOptions,
    statusOptions,
    taxedOptions,
    vacancyDurationOptions,
    vacancyRateOptions,
} from '../../models/HousingFilters';
import { useCampaignList } from '../../hooks/useCampaignList';
import FilterBadges from '../FiltersBadges/FiltersBadges';

const HousingFiltersBadges = ({ filters, onChange }: { filters: HousingFilters, onChange?: (_: any) => void}) => {

    const campaignList = useCampaignList();
    const { establishment } = useSelector((state: ApplicationState) => state.authentication.authUser);

    return (
        <>
            <FilterBadges options={ownerKindOptions}
                                 filters={filters.ownerKinds}
                                 onChange={onChange && (values => onChange({ownerKinds: values}))}/>
            <FilterBadges options={ownerAgeOptions}
                                 filters={filters.ownerAges}
                                 onChange={onChange && (values => onChange({ownerAges: values}))}/>
            <FilterBadges options={multiOwnerOptions}
                                 filters={filters.multiOwners}
                                 onChange={onChange && (values => onChange({multiOwners: values}))}/>
            <FilterBadges options={beneficiaryCountOptions}
                                 filters={filters.beneficiaryCounts}
                                 onChange={onChange && (values => onChange({beneficiaryCounts: values}))}/>
            <FilterBadges options={housingKindOptions}
                                 filters={filters.housingKinds}
                                 onChange={onChange && (values => onChange({housingKinds: values}))}/>
            <FilterBadges options={housingAreaOptions}
                                 filters={filters.housingAreas}
                                 onChange={onChange && (values => onChange({housingAreas: values}))}/>
            <FilterBadges options={roomsCountOptions}
                                 filters={filters.roomsCounts}
                                 onChange={onChange && (values => onChange({roomsCounts: values}))}/>
            <FilterBadges options={housingStateOptions}
                                 filters={filters.housingStates}
                                 onChange={onChange && (values => onChange({housingStates: values}))}/>
            <FilterBadges options={buildingPeriodOptions}
                                 filters={filters.buildingPeriods}
                                 onChange={onChange && (values => onChange({buildingPeriods: values}))}/>
            <FilterBadges options={vacancyDurationOptions}
                                 filters={filters.vacancyDurations}
                                 onChange={onChange && (values => onChange({vacancyDurations: values}))}/>
            <FilterBadges options={taxedOptions}
                                 filters={filters.isTaxedValues}
                                 onChange={onChange && (values => onChange({isTaxedValues: values}))}/>
            <FilterBadges options={ownershipKindsOptions}
                                 filters={filters.ownershipKinds}
                                 onChange={onChange && (values => onChange({ownershipKinds: values}))}/>
            <FilterBadges options={housingCountOptions}
                                 filters={filters.housingCounts}
                                 onChange={onChange && (values => onChange({housingCounts: values}))}/>
            <FilterBadges options={vacancyRateOptions}
                                 filters={filters.vacancyRates}
                                 onChange={onChange && (values => onChange({vacancyRates: values}))}/>
            <FilterBadges options={establishment.localities.map(l => ({value: l.geoCode, label: l.name}))}
                                 filters={filters.localities}
                                 onChange={onChange && (values => onChange({localities: values}))}/>
            <FilterBadges options={localityKindsOptions}
                                 filters={filters.localityKinds}
                                 onChange={onChange && (values => onChange({localityKinds: values}))}/>
            {establishment.housingScopes && establishment.housingScopes.scopes &&
                <FilterBadges options={[...establishment.housingScopes.scopes.map(hs => ({value: hs, label: hs})), outOfScopeOption]}
                                     filters={filters.housingScopes?.scopes}
                                     onChange={onChange && (values => onChange({housingScopes: {...establishment.housingScopes, scopes: values}}))}/>
            }
            <FilterBadges options={campaignsCountOptions}
                                 filters={filters.campaignsCounts}
                                 onChange={onChange && (values => onChange({campaignsCounts: values}))}/>
            <FilterBadges options={statusOptions}
                                 filters={filters.status?.map(_ => _.toString())}
                                 onChange={onChange && (values => onChange({status: values}))}/>
            {campaignList && filters.campaignIds &&
                <FilterBadges options={campaignList.map(c => ({value: c.id, label: c.name}))}
                                     filters={filters.campaignIds}
                                     onChange={onChange && (values => onChange({campaignIds: values}))}/>
            }
            <FilterBadges options={dataYearsOptions}
                                 filters={(filters.dataYears?? []).map(_ => String(_))}
                                 onChange={onChange && (values => onChange({dataYears: values}))}/>
            <FilterBadges options={[{value: filters.query ?? '', label: filters.query ?? ''}]}
                          filters={filters.query ? [filters.query] : []}
                          onChange={onChange && (() => onChange({query: ''}))}/>
        </>
    )

};

export default HousingFiltersBadges;

