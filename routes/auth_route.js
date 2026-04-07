const express = require("express");
const router = express.Router();
const {
    login,
    verifyCode,
    forgetPassword,
    verifyCodeForgetPassword,
    resetPassword
} = require("../controllers/auth_controller");
const { updateUserProfile } = require("../controllers/update_profile_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");


router.route("/login").post(login);
router.route("/verifycode").post(verifyCode);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyCodeForgetPassword").post(verifyCodeForgetPassword);
router.route("/resetPassword").post(resetPassword);

router.put("/updateProfile", uploadImage("user").single("picture"), updateUserProfile);

 

module.exports = router;
