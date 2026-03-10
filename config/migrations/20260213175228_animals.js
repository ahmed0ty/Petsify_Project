exports.up = function (knex) {
  return knex.schema.createTable("animal", (table) => {
    table.increments("id").primary();

    table.string("animalType").notNullable();
    table.string("animalSpecies").notNullable();
    table.integer("animalAge").notNullable();

    table.string("parentsBloodType").nullable();

    // store image path or filename
    table.string("healthCertificate").notNullable();
    table.string("picture").notNullable();

    table.string("location").notNullable();

    table.enum("type", ["mating", "adoption"]).notNullable();

    table.integer("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("user")
        .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("animal");
};
