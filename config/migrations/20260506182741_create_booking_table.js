exports.up = async function (knex) {
  const hasBookingTable = await knex.schema.hasTable("booking");

  if (!hasBookingTable) {
    await knex.schema.createTable("booking", (t) => {
      t.increments("id").primary();
      t.integer("parentId").unsigned().notNullable();
      t.integer("clinicId").unsigned().notNullable();
      t.string("animalName").notNullable();
      t.string("bookingDate").notNullable();
      t.string("bookingTime").notNullable();
      t.text("notes").nullable();
      t.enum("status", ["pending", "confirmed", "cancelled", "completed"]).defaultTo("pending");
      t.timestamps(true, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("booking");
};