const express = require("express");
const router = express.Router();
const { getAllUseres, signUpParent, updateUser, getUserDetails } = require("../controllers/user_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");

const { signUpUserValidator, updateUserValidator } = require("../utils/validator/user_validator");

router.route("/").post(uploadImage("user").single("picture"), signUpUserValidator, signUpParent).get(getAllUseres);
router.get("/:id", getUserDetails);
router.put("/:id", uploadImage("user").single("picture"), updateUserValidator, updateUser)

module.exports = router;
