exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE VIEW clinic_user_view AS
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

      -- CLINIC COLUMNS
      clinic.id AS clinic_id,
      clinic.professionalLicense,
      clinic.location AS clinic_location,
      clinic.startWorkAt,
      clinic.finishWorkAt,
      clinic.userId

    FROM clinic
    JOIN \`user\` ON clinic.userId = \`user\`.id;
  `);
};

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP VIEW IF EXISTS clinic_user_view;
  `);
};
