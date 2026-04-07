/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("order", (table) => {
        table.increments("id").primary();
        table
            .enum("status", ["pending", "accepted", "cancelled"])
            .defaultTo("pending");
        table.decimal("total_price", 10, 2).notNullable();
        table.decimal("delevery_fees", 10, 2).defaultTo(0);
       
        table.string("addresse").notNullable();
        table
            .integer("userId")
            .unsigned()
            .nullable()
            .references("id")
            .inTable("user")
            .onDelete("CASCADE");
        table.timestamps(true, true);  
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("order");
};
