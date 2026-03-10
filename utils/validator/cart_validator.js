const { check, body,param } = require("express-validator");
const { runValidation } = require("../../middlewares/validatorMiddleware");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");

exports.createCartValidator = [
    check("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isInt({ gt: 0 })
        .withMessage("userId must be a positive integer"),


    check("orderId")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("orderId must be a positive integer"),

    check("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer"),

    check("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isInt({ gt: 0 })
        .withMessage("quantity must be a positive integer"),

    runValidation,
];


exports.deleteCartValidator = [
    check("id")
        .notEmpty()
        .withMessage("cart ID is required")
        .bail()
        .custom(async (value) => {
            const cart = await db("cart").where({ id: value }).first();
            if (!cart) throw new ErrorAPI("cart not found", 404);
            return true;
        }),
    runValidation,
];

exports.incrementDecrementValidator = [
  check("cartId")
        .notEmpty()
        .withMessage("cart ID is required")
        .bail()
        .custom(async (value) => {
            const cart = await db("cart").where({ id: value }).first();
            if (!cart) throw new ErrorAPI("cart not found", 404);
            return true;
        }),
  runValidation,
];