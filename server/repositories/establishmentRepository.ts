import db from './db';
import { localitiesTable } from './localityRepository';
import { EstablishmentApi } from '../models/EstablishmentApi';

export const establishmentsTable = 'establishments';

const get = async (establishmentId: string): Promise<EstablishmentApi> => {
    try {
        return db
            .select(`${establishmentsTable}.*`,
                db.raw('json_agg(json_build_object(\'geo_code\', l.geo_code, \'name\', l.name)) as localities')
            )
            .from(establishmentsTable)
            .joinRaw(`join ${localitiesTable} as l on (l.id = any(${establishmentsTable}.localities_id))`)
            .where(`${establishmentsTable}.id`, establishmentId)
            .groupBy(`${establishmentsTable}.id`)
            .first()
            .then(result => {
                if (result) {
                    return <EstablishmentApi>{
                        id: result.id,
                        name: result.name,
                        housingScopes: result.housing_scopes ?? [],
                        localities: result.localities.map((l: { geo_code: any; name: any; }) => ({
                            geoCode: l.geo_code,
                            name: l.name
                        }))
                    }
                } else {
                    console.error('Establishment not found', establishmentId);
                    throw Error('Establishment not found')
                }
            })
    } catch (err) {
        console.error('Getting establishment failed', err, establishmentId);
        throw new Error('Getting establishment by email failed');
    }
}

const listAvailable = async (): Promise<EstablishmentApi[]> => {
    try {
        return db(establishmentsTable)
            .where('available', true)
            .then(_ => _.map(result => (
                    <EstablishmentApi> {
                    id: result.id,
                    name: result.name
                }
            )))
    } catch (err) {
        console.error('Listing available establishment failed', err);
        throw new Error('Listing available establishment by email failed');
    }
}

export default {
    get,
    listAvailable
}

