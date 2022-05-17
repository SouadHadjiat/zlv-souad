import {
    ANSWERS_COUNT_FETCHED,
    CONTACTED_OWNERS_COUNT_FETCHED,
    ESTABLISHMENTS_COUNT_FETCHED,
    FETCH_STATISTICS,
    HOUSING_FOLLOWED_COUNT_FETCHED,
    HOUSING_OUT_OF_VACANCY_COUNT_FETCHED,
    HOUSING_SUPPORTED_COUNT_FETCHED,
    StatisticActionTypes,
} from '../actions/statisticAction';

export interface StatisticState {
    establishmentCount?: number
    contactedOwnersCount?: number
    answersCount?: number
    housingFollowedCount?: number
    housingSupportedCount?: number
    housingOutOfVacancyCount?: number
}

const initialState: StatisticState = {
};

const statisticReducer = (state = initialState, action: StatisticActionTypes) => {
    switch (action.type) {
        case FETCH_STATISTICS:
            return {};
        case ESTABLISHMENTS_COUNT_FETCHED: {
            return {
                ...state,
                establishmentCount: action.count
            };
        }
        case CONTACTED_OWNERS_COUNT_FETCHED: {
            return {
                ...state,
                contactedOwnersCount: action.count
            };
        }
        case ANSWERS_COUNT_FETCHED: {
            return {
                ...state,
                answersCount: action.count
            };
        }
        case HOUSING_FOLLOWED_COUNT_FETCHED: {
            return {
                ...state,
                housingFollowedCount: action.count
            };
        }
        case HOUSING_SUPPORTED_COUNT_FETCHED: {
            return {
                ...state,
                housingSupportedCount: action.count
            };
        }
        case HOUSING_OUT_OF_VACANCY_COUNT_FETCHED: {
            return {
                ...state,
                housingOutOfVacancyCount: action.count
            };
        }
        default:
            return state;
    }
};

export default statisticReducer;