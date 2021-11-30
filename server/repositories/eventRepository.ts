import db from './db';
import { EventApi } from '../models/EventApi';

export const eventsTable = 'events';


const insert = async (eventApi: EventApi): Promise<EventApi> => {
    try {
        return db(eventsTable)
            .insert(formatEventApi(eventApi))
            .returning('*')
            .then(_ => _[0]);
    } catch (err) {
        console.error('Inserting event failed', err, eventApi);
        throw new Error('Inserting event failed');
    }
}

const listByOwnerId = async (ownerId: string): Promise<EventApi[]> => {
    try {
        return db(eventsTable)
            .where('owner_id', ownerId)
            .orderBy('created_at', 'desc')
            .then(_ => _.map(_ => parseEventApi(_)))
    } catch (err) {
        console.error('Listing events failed', err);
        throw new Error('Listing events failed');
    }
}

const addByCampaign = async (campaignId: string, events: EventApi[]): Promise<EventApi[]> => {

    try {
        return db(eventsTable)
            .insert(events.map(_ => formatEventApi(_)))
            .returning('*');
    } catch (err) {
        console.error('Inserting events for campaign failed', err, campaignId);
        throw new Error('Inserting events for campaign failed');
    }
}

const parseEventApi = (result: any) => <EventApi>{
    id: result.id,
    ownerId: result.owner_id,
    housingId: result.housing_id,
    kind: result.kind,
    createdAt: result.created_at,
    content: result.content
}


const formatEventApi = (eventApi: EventApi) => ({
    id: eventApi.id,
    owner_id: eventApi.ownerId,
    housing_id: eventApi.housingId,
    kind: eventApi.kind,
    created_at: eventApi.createdAt,
    content: eventApi.content
})

export default {
    insert,
    listByOwnerId,
    addByCampaign
}
