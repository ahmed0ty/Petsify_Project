const { check, body } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");


exports.deleteOrderValidator = [
  check("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .bail()
    .custom(async (value) => {
      const order = await db("orders").where({ id: value }).first();
      if (!order) throw new ErrorAPI("Order not found", 404);
      return true;
    }),
  runValidation,
];

exports.checkoutOrderValidator = [
  // Validate clientId logic
  body().custom(async (value, { req }) => {
    const userId = Number(req.body.clientId ?? 0);

    if (userId !== 0) {
      if (!Number.isInteger(userId) || userId < 0) {
        throw new Error("userId must be a positive integer");
      }
      const user = await db("users").where({ id: userId }).first();
      if (!user) throw new ErrorAPI("User not found", 404);
    }

    return true;
  }),
  // Validate addressId logic
  body("address")
    .notEmpty()
    .withMessage("address is required"),

  runValidation,
];

