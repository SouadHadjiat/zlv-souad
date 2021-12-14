import React from 'react';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import {
    beneficiaryCountOptions,
    buildingPeriodOptions,
    contactsCountOptions,
    housingAreaOptions,
    HousingFilterOption,
    housingKindOptions,
    housingStateOptions,
    multiOwnerOptions,
    ownerAgeOptions,
    ownerKindOptions, taxedOptions,
    vacancyDurationOptions,
} from '../../models/HousingFilters';

const HousingFilterBadges = ({options, filters, onChange}: {options: HousingFilterOption[], filters: string[], onChange?: (_: string[]) => void}) => {
    return (
        <>
            {options.filter(o => o.value.length && filters.indexOf(o.value) !== -1).map((option, index) =>
                <span className="fr-tag fr-tag--sm fr-fi-icon" key={option + '-' + index}>
                    {option.badgeLabel ?? option.label}
                    {onChange &&
                    <button className="ri-md ri-close-line fr-pr-0"
                            title="Supprimer le filtre"
                            onClick={() => {
                                onChange(filters.filter(v => v !== option.value))
                            }}>
                    </button>
                    }
                </span>
            )}
        </>
    )
}


const HousingFiltersBadges = ({ onChange }: { onChange?: (_: any) => void}) => {

    const { filters } = useSelector((state: ApplicationState) => state.housing);
    const { establishment } = useSelector((state: ApplicationState) => state.authentication.authUser);

    return (
        <>
            <HousingFilterBadges options={ownerKindOptions}
                          filters={filters.ownerKinds}
                          onChange={onChange && (values => onChange({ownerKinds: values}))}/>
            <HousingFilterBadges options={ownerAgeOptions}
                          filters={filters.ownerAges}
                          onChange={onChange && (values => onChange({ownerAges: values}))}/>
            <HousingFilterBadges options={multiOwnerOptions}
                          filters={filters.multiOwners}
                          onChange={onChange && (values => onChange({multiOwners: values}))}/>
            <HousingFilterBadges options={beneficiaryCountOptions}
                          filters={filters.beneficiaryCounts}
                          onChange={onChange && (values => onChange({beneficiaryCounts: values}))}/>
            <HousingFilterBadges options={housingKindOptions}
                          filters={filters.housingKinds}
                          onChange={onChange && (values => onChange({housingKinds: values}))}/>
            <HousingFilterBadges options={contactsCountOptions}
                          filters={filters.contactsCounts}
                          onChange={onChange && (values => onChange({contactsCounts: values}))}/>
            <HousingFilterBadges options={housingAreaOptions}
                          filters={filters.housingAreas}
                          onChange={onChange && (values => onChange({housingAreas: values}))}/>
            <HousingFilterBadges options={housingStateOptions}
                          filters={filters.housingStates}
                          onChange={onChange && (values => onChange({housingStates: values}))}/>
            <HousingFilterBadges options={buildingPeriodOptions}
                          filters={filters.buildingPeriods}
                          onChange={onChange && (values => onChange({buildingPeriods: values}))}/>
            <HousingFilterBadges options={vacancyDurationOptions}
                          filters={filters.vacancyDurations}
                          onChange={onChange && (values => onChange({vacancyDurations: values}))}/>
            <HousingFilterBadges options={taxedOptions}
                          filters={filters.isTaxedValues}
                          onChange={onChange && (values => onChange({isTaxedValues: values}))}/>
            <HousingFilterBadges options={establishment.localities.map(l => ({value: l.geoCode, label: l.name}))}
                          filters={filters.localities}
                          onChange={onChange && (values => onChange({localities: values}))}/>
            <HousingFilterBadges options={establishment.housingScopes.map(hs => ({value: hs, label: hs}))}
                          filters={filters.housingScopes}
                          onChange={onChange && (values => onChange({housingScopes: values}))}/>
            <HousingFilterBadges options={[{value: filters.query, label: filters.query}]}
                          filters={[filters.query]}
                          onChange={onChange && (() => onChange({query: ''}))}/>
        </>
    )

};

export default HousingFiltersBadges;

