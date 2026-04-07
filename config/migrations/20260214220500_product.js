/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('product', function(table) {
    table.increments('id').primary();

    table.string('picture').notNullable();   // image URL or file path
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('quantity').notNullable().defaultTo(0);
    table.decimal('discount', 5, 2).defaultTo(0); // percentage or fixed amount

    table
      .integer('sellerId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('seller')
      .onDelete('CASCADE');

    table.timestamps(true, true); // created_at & updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('product');
};
