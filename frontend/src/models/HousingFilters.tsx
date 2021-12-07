export interface HousingFilters {
    ownerKinds: string[];
    ownerAges: string[];
    multiOwners: string[];
    beneficiaryCounts: string[];
    contactsCounts: string[];
    housingKinds: string[];
    housingStates: string[];
    housingAreas: string[];
    buildingPeriods: string[];
    vacancyDurations: string[];
    isTaxedValues: string[];
    localities: string[];
    housingScopes: string[];
    query: string;
    excludedIds: string[];
}

export interface HousingFilterOption {
    value: string;
    label: string;
    badgeLabel?: string;
}

export const ownerAgeOptions: HousingFilterOption[] = [
    {value: "lt40", label: "Moins de 40 ans"},
    {value: "40to60", label: "40 - 60 ans"},
    {value: "60to75", label: "60 - 75 ans"},
    {value: "gt75", label: "75 ans et plus"}
];

export const ownerKindOptions: HousingFilterOption[] = [
    {value: "Particulier", label: "Particulier"},
    {value: "Investisseur", label: "Investisseur"},
    {value: "SCI", label: "SCI"},
    {value: "Autre", label: "Autres"}
];

export const contactsCountOptions: HousingFilterOption[] = [
    {value: "0", label: "Jamais contacté"},
    {value: "current", label: "En cours"},
    {value: "1", label: "1 fois"},
    {value: "2", label: "2 fois"},
    {value: "gt3", label: "3 fois ou plus"}
];

export const beneficiaryCountOptions: HousingFilterOption[] = [
    {value: "0", label: "Aucun", badgeLabel: "Aucun bénéficiaire"},
    {value: "1", label: "1", badgeLabel: "1 bénéficiaire"},
    {value: "2", label: "2", badgeLabel: "2 bénéficiaires"},
    {value: "3", label: "3", badgeLabel: "3 bénéficiaires"},
    {value: "4", label: "4", badgeLabel: "4 bénéficiaires"},
    {value: "gt5", label: "5 ou plus", badgeLabel: "5 bénéficiaires ou plus"},
];

export const housingKindOptions: HousingFilterOption[] = [
    {value: "APPART", label: "Appartement"},
    {value: "MAISON", label: "Maison"}
];

export const housingAreaOptions: HousingFilterOption[] = [
    {value: "lt35", label: "Moins de 35 m2"},
    {value: "35to75", label: "35 - 75 m2"},
    {value: "75to100", label: "75 - 100 m2"},
    {value: "gt100", label: "Plus de 100 m2"},
];

export const housingStateOptions: HousingFilterOption[] = [
    {value: "Inconfortable", label: "Inconfortable"}
];

export const buildingPeriodOptions: HousingFilterOption[] = [
    {value: "lt1919", label: "Avant 1919"},
    {value: "1919to1945", label: "Entre 1919 et 1945"},
    {value: "1946to1990", label: "Entre 1946 et 1990"},
    {value: "gt1991", label: "1991 ou après"},
];

export const multiOwnerOptions: HousingFilterOption[] = [
    {value: "true", label: "Oui", badgeLabel: "Multi-propriétaire"},
    {value: "false", label: "Non", badgeLabel: "Mono-propriétaire"}
];

export const vacancyDurationOptions = [
    {value: "lt2", label: "Moins de 2 ans"},
    {value: "2to5", label: "2 - 5 ans"},
    {value: "gt5", label: "Plus de 5 ans"},
    {value: "gt10", label: "Plus de 10 ans"}
];

export const taxedOptions: HousingFilterOption[] = [
    {value: "true", label: "Oui", badgeLabel: "Taxé"},
    {value: "false", label: "Non", badgeLabel: "Non taxé"}
];

export const hasFilters = (housingFilters: HousingFilters) => {
    return Boolean(housingFilters.ownerKinds.length ||
        housingFilters.ownerAges.length ||
        housingFilters.multiOwners.length ||
        housingFilters.beneficiaryCounts.length ||
        housingFilters.contactsCounts.length ||
        housingFilters.housingKinds.length ||
        housingFilters. housingStates.length ||
        housingFilters.housingAreas.length ||
        housingFilters.buildingPeriods.length ||
        housingFilters.vacancyDurations.length ||
        housingFilters.isTaxedValues.length ||
        housingFilters.query.length);
}
