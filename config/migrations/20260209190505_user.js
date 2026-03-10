/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.string("fullName").notNullable();
    table.string("phone").nullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("picture").nullable();
    table.enum("role", ["parent", "sitter", "clinic", "seller","admin"])
    table.string("verifyCode");
    table.boolean("emailIsVerified").defaultTo(false);
    table.boolean("isActive").defaultTo(false)
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user");
};
