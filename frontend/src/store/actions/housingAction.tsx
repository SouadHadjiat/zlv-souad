import { Dispatch } from 'redux';
import { Housing } from '../../models/Housing';
import housingService from '../../services/housing.service';

export const FETCH_HOUSING = 'FETCH_HOUSING';

export interface FetchHousingAction {
    type: typeof FETCH_HOUSING,
    housingList: Housing[]
}

export type HousingActionTypes = FetchHousingAction;

export const listHousing = () => {
    return function (dispatch: Dispatch) {
        housingService.listHousing()
            .then(housingList => {
                dispatch({
                    type: FETCH_HOUSING,
                    housingList
                });
            });
    };
};
