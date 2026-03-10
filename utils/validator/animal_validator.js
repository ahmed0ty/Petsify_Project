const { check } = require("express-validator");
const db = require("../../config/db");
const ErrorAPI = require("../../utils/ErrorAppi");
const { runValidation } = require("../../middlewares/validatorMiddleware");


exports.createAnimalValidator = [

    check("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isInt({ min: 1 })
        .withMessage("userId must be a positive integer"),
    check("animalType")
        .notEmpty()
        .withMessage("animalType is required")
        .isString()
        .withMessage("animalType must be a string"),

    check("animalSpecies")
        .notEmpty()
        .withMessage("animalSpecies is required")
        .isString()
        .withMessage("animalSpecies must be a string"),

    check("animalAge")
        .notEmpty()
        .withMessage("animalAge is required")
        .isInt({ min: 0 })
        .withMessage("animalAge must be a positive number"),

    check("parentsBloodType")
        .optional()
        .isString()
        .withMessage("parentsBloodType must be a string"),

    // healthCertificate file validation
    check("healthCertificate").custom((_, { req }) => {
        if (
            !req.files?.healthCertificate ||
            req.files.healthCertificate.length === 0
        ) {
            throw new ErrorAPI("healthCertificate is required");
        }
        return true;
    }),

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

    check("location")
        .notEmpty()
        .withMessage("location is required")
        .isString()
        .withMessage("location must be a string"),

    check("type")
        .notEmpty()
        .withMessage("type is required")
        .isIn(["mating", "adoption"])
        .withMessage("type must be either mating or adoption"),

    runValidation,
];
