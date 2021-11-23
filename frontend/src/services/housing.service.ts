import config from '../utils/config';
import authService from './auth.service';
import { HousingFilters } from '../models/HousingFilters';
import { Housing } from '../models/Housing';
import { PaginatedResult } from '../models/PaginatedResult';
import ownerService from './owner.service';


const listHousing = async (filters: HousingFilters, page: number, perPage: number): Promise<PaginatedResult<Housing>> => {

    return await fetch(`${config.apiEndpoint}/api/housing`, {
        method: 'POST',
        headers: { ...authService.authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, page, perPage }),
    })
        .then(_ => _.json())
        .then(result => ({
            ...result,
            entities: result.entities.map((e: any) => parseHousing(e))
        }));
};

const listByOwner = async (ownerId: string) => {

    return await fetch(`${config.apiEndpoint}/api/housing/owner/${ownerId}`, {
        method: 'GET',
        headers: { ...authService.authHeader(), 'Content-Type': 'application/json' }
    }).then(_ => _.json());
};

const listByCampaign = async (campaignId: string) => {

    return await fetch(`${config.apiEndpoint}/api/housing/campaign/${campaignId}`, {
        method: 'GET',
        headers: { ...authService.authHeader(), 'Content-Type': 'application/json' }
    }).then(_ => _.json());
};

const parseHousing = (h: any): Housing => ({
    ...h,
    owner: ownerService.parseOwner(h.owner)
} as Housing)

const housingService = {
    listHousing,
    listByOwner,
    listByCampaign
};

export default housingService;
