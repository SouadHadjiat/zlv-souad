import { Owner1 } from './003-owner';
import { genHousingApi } from '../../../server/test/testFixtures';
import housingRepository, { housingTable, ownersHousingTable } from '../../../server/repositories/housingRepository';
import { Locality1 } from './001-establishments';
import { Knex } from 'knex';

export const Housing1 = genHousingApi(Locality1.geoCode);
export const Housing2 = genHousingApi(Locality1.geoCode);

// @ts-ignore
exports.seed = function(knex: Knex) {
    return Promise.all([
        knex.table(housingTable).insert([
            housingRepository.formatHousingApi(Housing1),
            housingRepository.formatHousingApi(Housing2),
        ]).then(() =>
            knex.table(ownersHousingTable).insert([
                {
                    owner_id: Owner1.id,
                    housing_id: Housing1.id
                },
                {
                    owner_id: Owner1.id,
                    housing_id: Housing2.id
                }
            ])
        )
    ])
};
