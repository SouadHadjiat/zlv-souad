import { Housing } from '../../models/Housing';
import { FETCH_HOUSING_LIST, HOUSING_LIST_FETCHED, HousingActionTypes } from '../actions/housingAction';
import { HousingFilters } from '../../models/HousingFilters';
import { PaginatedResult } from '../../models/PaginatedResult';
import config from '../../utils/config';


export interface HousingState {
    paginatedHousing: PaginatedResult<Housing>;
    filters: HousingFilters;
}

export const initialHousingFilters = {
    ownerKinds: [],
    ownerAges: [],
    multiOwners: [],
    beneficiaryCounts: [],
    housingKinds: [],
    housingStates: [],
    housingAreas: [],
    roomsCounts: [],
    buildingPeriods: [],
    vacancyDurations: [],
    isTaxedValues: [],
    ownershipKinds: [],
    housingCounts: [],
    vacancyRates: [],
    campaignsCounts: [],
    campaignIds: [],
    localities: [],
    localityKinds: [],
    housingScopes: {geom: true, scopes: []},
    dataYearsIncluded: [config.dataYear + 1],
    dataYearsExcluded: [],
    query: ''
} as HousingFilters;

const initialState = {
    paginatedHousing: {
        entities: [],
        page: 1,
        perPage: config.perPageDefault,
        totalCount: 0,
        loading: true
    },
    filters: initialHousingFilters,
    checkedHousingIds: []
};

const housingReducer = (state = initialState, action: HousingActionTypes) => {
    switch (action.type) {
        case FETCH_HOUSING_LIST:
            return {
                ...state,
                paginatedHousing: {
                    entities: [],
                    totalCount: 0,
                    page: action.page,
                    perPage: action.perPage,
                    loading: true
                },
                filters: action.filters
            };
        case HOUSING_LIST_FETCHED: {
            const isCurrentFetching =
                action.filters === state.filters &&
                action.paginatedHousing.page === state.paginatedHousing.page &&
                action.paginatedHousing.perPage === state.paginatedHousing.perPage
            return !isCurrentFetching ? state : {
                ...state,
                paginatedHousing: {
                    ...state.paginatedHousing,
                    entities: action.paginatedHousing.entities,
                    totalCount: action.paginatedHousing.totalCount,
                    loading: false
                }
            };
        }
        default:
            return state;
    }
};

export default housingReducer;
