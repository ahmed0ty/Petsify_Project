exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE VIEW seller_user_view AS
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

      -- SELLER COLUMNS
      seller.id AS seller_id,
      seller.proofOfBusiness,
      seller.userId

    FROM seller
    JOIN \`user\` ON seller.userId = \`user\`.id;
  `);
};

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP VIEW IF EXISTS seller_user_view;
  `);
};
