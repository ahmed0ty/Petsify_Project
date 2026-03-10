exports.up = function (knex) {
  return knex.raw(`
    CREATE VIEW cart_view AS
    SELECT 
      cart.id,
      cart.userId,
      cart.productId,
      cart.quantity,
      cart.created_at,

      product.name,
      product.discount,
      product.picture,
      product.price,
      product.description,
      product.quantity AS availableQuantity,

      (product.price * cart.quantity) AS totalPrice,

      -- discount as percentage
      (product.price * cart.quantity) 
        - ((product.price * cart.quantity) * product.discount / 100) 
        AS discountedPrice

    FROM cart
    JOIN product ON cart.productId = product.id
    WHERE cart.orderId IS NULL
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP VIEW IF EXISTS cart_view
  `);
};
