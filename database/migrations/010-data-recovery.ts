// @ts-ignore
exports.up = function(knex) {
    return Promise.all([
        knex.schema// @ts-ignore
            .alterTable('housing', (table) => {
                table.specificType('data_years', 'integer[]').defaultTo('{2021}');
            }),
        knex.schema// @ts-ignore
            .alterTable('campaigns', (table) => {
                table.integer('kind').alter();
                table.renameColumn('kind', 'reminder_number');
            }),
        knex.schema// @ts-ignore
            .alterTable('campaigns_housing', (table) => {
                table.string('advice');
            })
    ]);
};

// @ts-ignore
exports.down = function(knex) {
  return Promise.all([
      knex.schema// @ts-ignore
          .alterTable('campaigns', (table) => {
              table.renameColumn('reminder_number', 'kind')
          }),
      knex.schema// @ts-ignore
          .alterTable('campaigns_housing', (table) => {
              table.dropColumn('advice');
          }),
      knex.schema// @ts-ignore
          .alterTable('housing', (table) => {
              table.dropColumn('data_years');
          })
  ]);
};
