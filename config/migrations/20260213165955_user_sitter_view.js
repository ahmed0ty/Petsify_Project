exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE VIEW sitter_user_view AS
    SELECT
      -- USER COLUMNS (without password)
      \`user\`.id AS user_id,
      \`user\`.fullName,
      \`user\`.phone,
      \`user\`.email,
      \`user\`.picture,
      \`user\`.role,
      \`user\`.verifyCode,
      \`user\`.emailIsVerified,
      \`user\`.isActive,
      \`user\`.created_at AS user_created_at,
      \`user\`.updated_at AS user_updated_at,

      -- SITTER COLUMNS
      sitter.id AS sitter_id,
      sitter.proofOfExperience,
      sitter.location AS sitter_location,
      sitter.userId

    FROM sitter
    JOIN \`user\` ON sitter.userId = \`user\`.id;
  `);
};
exports.down = function (knex) {
  return knex.schema.raw(`
    DROP VIEW IF EXISTS sitter_user_view;
  `);
};