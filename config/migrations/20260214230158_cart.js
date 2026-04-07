/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("cart", (table) => {
    table.increments("id").primary();
    table.decimal("discount", 10, 2).defaultTo(0);

    table
      .integer("userId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");

    table
      .integer("orderId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("order")
      .onDelete("CASCADE");

    table
      .integer("productId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("product")
      .onDelete("CASCADE");

    table.integer('quantity').notNullable().unsigned();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("cart");
};
