const { check } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");

exports.signUpClinicValidator = [
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

    check("professionalLicense").custom((_, { req }) => {
        if (!req.files?.professionalLicense || req.files.professionalLicense.length === 0) {
            throw new Error("professionalLicense is required");
        }
        return true;
    }),
    check("location")
        .notEmpty()
        .withMessage("location is required")
        .isString()
        .withMessage("location must be a string"),

    check("startWorkAt")
        .notEmpty()
        .withMessage("startWorkAt is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("startWorkAt must be in HH:MM:SS format"),

    check("finishWorkAt")
        .notEmpty()
        .withMessage("finishWorkAt is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("finishWorkAt must be in HH:MM:SS format"),


    check("role")
        .notEmpty()
        .withMessage("role is required")
        .bail()
        .isIn(["parent", "sitter", "clinic", "seller", "admin"])
        .withMessage("role must be one of: parent, sitter, clinic, seller, admin"),


    runValidation,
];
