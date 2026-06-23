const express = require("express");
const router = express.Router();
const { getAllUseres, signUpParent, updateUser, getUserDetails, deleteUser, getUserById } = require("../controllers/user_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");

const { signUpUserValidator, updateUserValidator } = require("../utils/validator/user_validator");

router.route("/").post(uploadImage("user").single("picture"), signUpUserValidator, signUpParent).get(getAllUseres);
router.get("/:id/details", getUserDetails);
router.get("/:id", getUserById);
router.put("/:id", uploadImage("user").single("picture"), updateUserValidator, updateUser)
router.delete("/:id", deleteUser);

module.exports = router;