import { CampaignApi } from '../models/CampaignApi';
import db from './db';
import { campaignsHousingTable } from './campaignHousingRepository';

export const campaignsTable = 'campaigns';


const get = async (campaignId: string): Promise<CampaignApi> => {
    try {
        return db(campaignsTable)
            .where('id', campaignId)
            .first();
    } catch (err) {
        console.error('Getting campaign failed', err, campaignId);
        throw new Error('Getting campaigns failed');
    }
}

const list = async (): Promise<CampaignApi[]> => {
    try {
        return db
            .select(`${campaignsTable}.*`)
            .count('id', {as: 'housingCount'})
            .from(campaignsTable)
            .leftJoin(campaignsHousingTable, 'id', `${campaignsHousingTable}.campaignId`)
            .groupBy('id')
    } catch (err) {
        console.error('Listing campaigns failed', err);
        throw new Error('Listing campaigns failed');
    }
}

const lastCampaignNumber = async (): Promise<any> => {
    try {
        return db(campaignsTable)
            .max('campaignNumber')
            .first()
            .then(_ => _ ? _.max : 0);
    } catch (err) {
        console.error('Listing campaigns failed', err);
        throw new Error('Listing campaigns failed');
    }
}

const insert = async (campaignApi: CampaignApi): Promise<CampaignApi> => {
    try {
        return db(campaignsTable)
            .insert(campaignApi)
            .returning('*')
            .then(_ => _[0]);
    } catch (err) {
        console.error('Inserting campaign failed', err, campaignApi);
        throw new Error('Inserting campaign failed');
    }
}

const update = async (campaignApi: CampaignApi): Promise<CampaignApi> => {
    try {
        return db(campaignsTable)
            .where('id', campaignApi.id)
            .update(campaignApi)
            .returning('*')
            .then(_ => _[0]);
    } catch (err) {
        console.error('Updating campaign failed', err, campaignApi);
        throw new Error('Updating campaign failed');
    }
}

export default {
    get,
    list,
    lastCampaignNumber,
    insert,
    update
}
