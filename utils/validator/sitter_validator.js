const { check } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");

exports.signUpSittererValidator = [
    check("fullName")
        .notEmpty()
        .withMessage("fullName is required")
        .isString()
        .withMessage("fullName must be a string"),

    check("phone")
        .notEmpty({ checkFalsy: true })
        .withMessage("phone is required")
        .isMobilePhone()
        .withMessage("phone must be a valid mobile number")
        .bail()
        .custom(async (value) => {
            const phoneExists = await db("user").where({ phone: value }).first();
            if (phoneExists) throw new ErrorAPI("Phone already exists", 400);
            return true;
        }),


    check("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .custom(async (value) => {
            const emailExists = await db("user").where({ email: value }).first();
            if (emailExists) throw new ErrorAPI("Email already exists", 400);
            return true;
        }),

    check("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    check("picture")
        .optional(),


    check("location")
        .notEmpty()
        .withMessage("location is required")
        .isString()
        .withMessage("location must be a string"),

    check("proofOfExperience").custom((_, { req }) => {
        if (!req.files?.proofOfExperience || req.files.proofOfExperience.length === 0) {
            throw new Error("proof of business is required");
        }
        return true;
    }),
    check("role")
        .notEmpty()
        .withMessage("role is required")
        .bail()
        .isIn(["parent", "sitter", "clinic", "seller", "admin"])
        .withMessage("role must be one of: parent, sitter, clinic, seller, admin"),

    runValidation,
];