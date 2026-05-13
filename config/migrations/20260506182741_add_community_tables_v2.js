exports.up = async function (knex) {
  const hasPostsTable = await knex.schema.hasTable("community_posts");
  const hasLikesTable = await knex.schema.hasTable("community_likes");
  const hasCommentsTable = await knex.schema.hasTable("community_comments");
  const hasConnectionsTable = await knex.schema.hasTable("community_connections");
  const hasNotificationsTable = await knex.schema.hasTable("community_notifications");

  if (!hasPostsTable) {
    await knex.schema.createTable("community_posts", (t) => {
      t.increments("id").primary();
      t.integer("user_id").unsigned().notNullable();
      t.text("content").notNullable();
      t.string("image").nullable();
      t.timestamps(true, true);
    });
  }

  if (!hasLikesTable) {
    await knex.schema.createTable("community_likes", (t) => {
      t.increments("id").primary();
      t.integer("post_id").unsigned().notNullable();
      t.integer("user_id").unsigned().notNullable();
      t.timestamps(true, true);
      t.unique(["post_id", "user_id"]);
    });
  }

  if (!hasCommentsTable) {
    await knex.schema.createTable("community_comments", (t) => {
      t.increments("id").primary();
      t.integer("post_id").unsigned().notNullable();
      t.integer("user_id").unsigned().notNullable();
      t.text("content").notNullable();
      t.integer("parent_id").unsigned().nullable();
      t.timestamps(true, true);
    });
  }

  if (!hasConnectionsTable) {
    await knex.schema.createTable("community_connections", (t) => {
      t.increments("id").primary();
      t.integer("sender_id").unsigned().notNullable();
      t.integer("receiver_id").unsigned().notNullable();
      t.enum("status", ["pending", "accepted", "rejected"]).defaultTo("pending");
      t.timestamps(true, true);
    });
  }

  if (!hasNotificationsTable) {
    await knex.schema.createTable("community_notifications", (t) => {
      t.increments("id").primary();
      t.integer("user_id").unsigned().notNullable();
      t.integer("actor_id").unsigned().notNullable();
      t.enum("type", ["like", "comment", "reply", "connection_request", "connection_accepted"]);
      t.integer("post_id").unsigned().nullable();
      t.boolean("is_read").defaultTo(false);
      t.timestamps(true, true);
    });
  }
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("community_notifications")
    .dropTableIfExists("community_connections")
    .dropTableIfExists("community_comments")
    .dropTableIfExists("community_likes")
    .dropTableIfExists("community_posts");
};