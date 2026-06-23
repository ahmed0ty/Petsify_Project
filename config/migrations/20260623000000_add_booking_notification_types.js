exports.up = async function (knex) {
  await knex.schema.alterTable("community_notifications", (t) => {
    t.enum("type", [
      "like",
      "comment",
      "reply",
      "connection_request",
      "connection_accepted",
      "booking_confirmed",
      "booking_cancelled",
    ]).notNullable().alter();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("community_notifications", (t) => {
    t.enum("type", [
      "like",
      "comment",
      "reply",
      "connection_request",
      "connection_accepted",
    ]).notNullable().alter();
  });
};