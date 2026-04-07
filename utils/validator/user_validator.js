const { check } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");

exports.signUpUserValidator = [
  check("fullName")
    .notEmpty()
    .withMessage("fullName is required")
    .isString()
    .withMessage("firstName must be a string"),

  check("phone")
    .optional({ checkFalsy: true })
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

  check("role")
    .notEmpty()
    .withMessage("role is required")
    .bail()
    .isIn(["parent", "sitter", "clinic", "seller", "admin"])
    .withMessage("role must be one of: parent, sitter, clinic, seller, admin"),

  runValidation,
];

exports.updateUserValidator = [
  check("id")
    .custom((value, { req }) => {
      if (!req.params.id) throw new ErrorAPI("id for user is required", 400);
      return true;
    })
    .bail()
    .custom(async (value, { req }) => {
      const user = await db("user").where({ id: req.params.id }).first();
      if (!user) throw new ErrorAPI("User not found", 404);
      return true;
    }),


  check("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .custom(async (value, { req }) => {
      const exists = await db("user")
        .where({ phone: value })
        .andWhereNot("id", req.params.id)
        .first();

      if (exists) throw new ErrorAPI("Phone already in use", 400);
      return true;
    }),

  check("picture")
    .optional(),

  check("fullName")
    .optional(),


  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const exists = await db("user")
        .where({ email: value })
        .andWhereNot("id", req.params.id)
        .first();

      if (exists) throw new ErrorAPI("Email already in use", 400);
      return true;
    }),


  runValidation,
];

exports.getUserByIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),
  runValidation,
];

exports.deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User ID is required")
    .bail()
    .custom(async (value) => {
      const user = await db("user").where({ id: value }).first();
      if (!user) throw new ErrorAPI("User not found", 404);
      return true;
    }),
  runValidation,
];
