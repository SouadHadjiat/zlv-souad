import { Campaign } from '../../models/Campaign';
import {
    CAMPAIGN_HOUSING_LIST_FETCHED,
    CAMPAIGN_LIST_FETCHED,
    CampaignActionTypes,
    FETCH_CAMPAIGN_HOUSING_LIST,
    FETCH_CAMPAIGN_LIST,
} from '../actions/campaignAction';
import { Housing } from '../../models/Housing';


export interface CampaignState {
    campaignList: Campaign[];
    search: string;
    campaignId: string;
    campaignHousingList: Housing[]
}

const initialState = {
    campaignList: [],
    search: undefined
};

const campaignReducer = (state = initialState, action: CampaignActionTypes) => {
    switch (action.type) {
        case FETCH_CAMPAIGN_LIST:
            return {
                ...state,
                campaignList: [],
                search: action.search
            };
        case CAMPAIGN_LIST_FETCHED:
            return {
                ...state,
                campaignList: (action.search === state.search) ? action.campaignList : state.campaignList
            };
        case FETCH_CAMPAIGN_HOUSING_LIST:
            return {
                ...state,
                campaignId: action.campaignId
            };
        case CAMPAIGN_HOUSING_LIST_FETCHED:
            return {
                ...state,
                campaignHousingList: action.campaignHousingList
            };
        default:
            return state;
    }
};

export default campaignReducer;