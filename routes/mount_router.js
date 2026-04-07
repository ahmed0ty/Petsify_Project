const mountRoutes = (app) => {
  app.use("/api/v1/user", require("./user_route"));
  app.use("/api/v1/seller", require("./seller_route"));
  app.use("/api/v1/clinic", require("./clinic_route"));
  app.use("/api/v1/sitter", require("./sitter_route"));
  app.use("/api/v1/auth", require("./auth_route"));
  app.use("/api/v1/animal", require("./animal_route"));
  app.use("/api/v1/product", require("./product_route"));
  app.use("/api/v1/cart", require("./cart_route"));
  app.use("/api/v1/order", require("./order_route"));

};

module.exports = mountRoutes;
