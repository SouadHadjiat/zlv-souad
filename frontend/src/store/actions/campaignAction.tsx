import { Dispatch } from 'redux';
import { Campaign, CampaignSteps, DraftCampaign } from '../../models/Campaign';
import campaignService from '../../services/campaign.service';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import housingService from '../../services/housing.service';
import { ApplicationState } from '../reducers/applicationReducers';
import { PaginatedResult } from '../../models/PaginatedResult';
import { CampaignHousing, Housing } from '../../models/Housing';
import { CampaignHousingStatus } from '../../models/CampaignHousingStatus';

export const FETCH_CAMPAIGN_LIST = 'FETCH_CAMPAIGN_LIST';
export const CAMPAIGN_LIST_FETCHED = 'CAMPAIGN_LIST_FETCHED';
export const FETCH_CAMPAIGN = 'FETCH_CAMPAIGN';
export const CAMPAIGN_FETCHED = 'CAMPAIGN_FETCHED';
export const FETCH_CAMPAIGN_HOUSING_LIST = 'FETCH_CAMPAIGN_HOUSING_LIST';
export const CAMPAIGN_HOUSING_LIST_FETCHED = 'CAMPAIGN_HOUSING_LIST_FETCHED';
export const CAMPAIGN_CREATED = 'CAMPAIGN_CREATED';
export const CAMPAIGN_UPDATED = 'CAMPAIGN_UPDATED';

export interface FetchCampaignListAction {
    type: typeof FETCH_CAMPAIGN_LIST
}

export interface CampaignListFetchedAction {
    type: typeof CAMPAIGN_LIST_FETCHED,
    campaignList: Campaign[]
}

export interface FetchCampaignAction {
    type: typeof FETCH_CAMPAIGN
    campaignFetchingId: string
}

export interface CampaignFetchedAction {
    type: typeof CAMPAIGN_FETCHED,
    campaign: Campaign[]
    campaignFetchingId: string
}

export interface FetchCampaignHousingListAction {
    type: typeof FETCH_CAMPAIGN_HOUSING_LIST,
    campaignHousingFetchingId: string,
    status: CampaignHousingStatus,
    page: number,
    perPage: number
}

export interface CampaignHousingListFetchedAction {
    type: typeof CAMPAIGN_HOUSING_LIST_FETCHED,
    campaignHousingFetchingId: string,
    status: CampaignHousingStatus,
    paginatedHousing: PaginatedResult<CampaignHousing>,
    exportURL: string
}

export interface CampaignCreatedAction {
    type: typeof CAMPAIGN_CREATED,
    campaignId: string
}

export interface CampaignUpdatedAction {
    type: typeof CAMPAIGN_UPDATED,
    campaign: Campaign
}

export type CampaignActionTypes =
    FetchCampaignListAction
    | CampaignListFetchedAction
    | FetchCampaignAction
    | CampaignFetchedAction
    | FetchCampaignHousingListAction
    | CampaignHousingListFetchedAction
    | CampaignCreatedAction
    | CampaignUpdatedAction;

export const listCampaigns = () => {

    return function (dispatch: Dispatch) {

        dispatch(showLoading());

        dispatch({
            type: FETCH_CAMPAIGN_LIST
        });

        campaignService.listCampaigns()
            .then(campaignList => {
                dispatch(hideLoading());
                dispatch({
                    type: CAMPAIGN_LIST_FETCHED,
                    campaignList
                });
            });
    };
};

export const getCampaign = (campaignId: string) => {

    return function (dispatch: Dispatch) {

        dispatch(showLoading());

        dispatch({
            type: FETCH_CAMPAIGN
        });

        campaignService.getCampaign(campaignId)
            .then(campaign => {
                dispatch(hideLoading());
                dispatch({
                    type: CAMPAIGN_FETCHED,
                    campaign
                });
            });
    };
};

export const listCampaignHousing = (campaignId: string, status: CampaignHousingStatus) => {

    return function (dispatch: Dispatch, getState: () => ApplicationState) {

        dispatch(showLoading());

        const page = 1
        const perPage = getState().campaign.campaignHousingByStatus[status].perPage

        dispatch({
            type: FETCH_CAMPAIGN_HOUSING_LIST,
            campaignHousingFetchingId: campaignId,
            status,
            page,
            perPage,
        });

        housingService.listByCampaign(campaignId, page, perPage, status)
            .then((result: PaginatedResult<Housing>) => {
                dispatch(hideLoading());
                dispatch({
                    type: CAMPAIGN_HOUSING_LIST_FETCHED,
                    campaignHousingFetchingId: campaignId,
                    status,
                    paginatedHousing: result,
                    exportURL: campaignService.getExportURL(campaignId)
                });
            });
    };
};


export const changeCampaignHousingPagination = (page: number, perPage: number, status: CampaignHousingStatus, excludedIds?: string[]) => {

    return function (dispatch: Dispatch, getState: () => ApplicationState) {

        const campaignId = getState().campaign.campaign?.id

        if (campaignId) {

            dispatch(showLoading());

            dispatch({
                type: FETCH_CAMPAIGN_HOUSING_LIST,
                campaignHousingFetchingId: campaignId,
                status,
                page: page,
                perPage
            });

            housingService.listByCampaign(campaignId, page, perPage, status, excludedIds)
                .then((result: PaginatedResult<Housing>) => {
                    dispatch(hideLoading());
                    dispatch({
                        type: CAMPAIGN_HOUSING_LIST_FETCHED,
                        campaignHousingFetchingId: campaignId,
                        status,
                        paginatedHousing: result,
                        exportURL: campaignService.getExportURL(campaignId)
                    });
                });
        }
    };
};


export const createCampaign = (draftCampaign: DraftCampaign, allHousing: boolean, housingIds: string[]) => {

    return function (dispatch: Dispatch) {

        dispatch(showLoading());

        campaignService.createCampaign(draftCampaign, allHousing, housingIds)
            .then((campaignId) => {
                dispatch(hideLoading());
                dispatch({
                    type: CAMPAIGN_CREATED,
                    campaignId
                });
            });
    };
};

export const validCampaignStep = (campaignId: string, step: CampaignSteps, params?: {sendingDate?: Date, excludeHousingIds?: string[]}) => {

    return function (dispatch: Dispatch) {

        dispatch(showLoading());

        campaignService.validCampaignStep(campaignId, step, params)
            .then(campaign => {
                dispatch(hideLoading());
                dispatch({
                    type: CAMPAIGN_UPDATED,
                    campaign
                });
            });
    };
};

export const updateCampaignHousing = (campaignHousing: CampaignHousing, prevStatus: CampaignHousingStatus) => {

    return function (dispatch: Dispatch, getState: () => ApplicationState) {

        dispatch(showLoading());

        const paginatedHousing = getState().campaign.campaignHousingByStatus[prevStatus];

        housingService.updateCampaignHousing(campaignHousing)
            .then(_ => {
                dispatch(hideLoading());
                changeCampaignHousingPagination(paginatedHousing.page, paginatedHousing.perPage, prevStatus)(dispatch, getState);
                changeCampaignHousingPagination(paginatedHousing.page, paginatedHousing.perPage, campaignHousing.status)(dispatch, getState);
                getCampaign(campaignHousing.campaignId)(dispatch);
            });

    }
}


