/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("clinic", (table) => {
        table.increments('id').primary();
        table.string('professionalLicense').notNullable();
        table.string('location').notNullable();
        table.time('startWorkAt').notNullable();
        table.time('finishWorkAt').notNullable();
        table
            .integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("user")
            .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("clinic");
};
