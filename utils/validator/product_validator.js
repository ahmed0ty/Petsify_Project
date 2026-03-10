const { check } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");

exports.createProductValidator = [

    // sellerId
    check("sellerId")
        .notEmpty()
        .withMessage("sellerId is required")
        .isInt({ min: 1 })
        .withMessage("sellerId must be a positive integer"),

    // name
    check("name")
        .notEmpty()
        .withMessage("name is required")
        .isString()
        .withMessage("name must be a string")
        .isLength({ min: 2, max: 255 })
        .withMessage("name must be between 2 and 255 characters"),


        // name
    check("description")
        .notEmpty()
        .withMessage("description is required")
        .isString()
        .withMessage("description must be a string")
        .isLength({ min: 2, max: 255 })
        .withMessage("description must be between 2 and 255 characters"),

    // price
    check("price")
        .notEmpty()
        .withMessage("price is required")
        .isFloat({ min: 0 })
        .withMessage("price must be a positive number"),

    // quantity
    check("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .isInt({ min: 0 })
        .withMessage("quantity must be a non-negative integer"),

    // discount
    check("discount")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("discount must be a number between 0 and 100"),

    // picture file validation
    check("picture").custom((_, { req }) => {
        if (
            !req.files?.picture ||
            req.files.picture.length === 0
        ) {
            throw new ErrorAPI("picture is required");
        }
        return true;
    }),

    runValidation,
];
