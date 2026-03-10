exports.up = async function (knex) {
  await knex.raw(`
    CREATE VIEW pending_order_items AS
    SELECT 
      -- CART
      c.id AS cart_id,
      c.discount AS cart_discount,
      c.userId AS cart_userId,
      c.orderId,
      c.productId,
      c.quantity AS cart_quantity,
      c.created_at AS cart_created_at,
      c.updated_at AS cart_updated_at,

      -- PRODUCT
      p.id AS product_id,
      p.picture,
      p.name,
      p.description,
      p.price,
      p.quantity AS product_quantity,
      p.discount AS product_discount,
      p.sellerId,
      p.created_at AS product_created_at,
      p.updated_at AS product_updated_at,

      -- ORDER
      o.id AS order_id,
      o.status,
      o.total_price,
      o.delevery_fees,
      o.addresse,
      o.userId AS order_userId,
      o.created_at AS order_created_at,
      o.updated_at AS order_updated_at,

      -- USER (Order Owner)
      u.id AS user_id,
      u.fullName,
      u.phone,
      u.email,
      u.picture AS user_picture,
      u.role,
      u.emailIsVerified,
      u.isActive,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at

    FROM cart AS c
    JOIN product AS p ON p.id = c.productId
    JOIN \`order\` AS o ON c.orderId = o.id
    JOIN \`user\` AS u ON o.userId = u.id
    WHERE c.orderId IS NOT NULL
  `);
};

exports.down = async function (knex) {
  await knex.raw(`DROP VIEW IF EXISTS pending_order_items`);
};