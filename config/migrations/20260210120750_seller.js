/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("seller", (table) => {
        table.increments('id').primary();
        table.string('proofOfBusiness').notNullable();
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
    return knex.schema.dropTableIfExists("seller");
};
