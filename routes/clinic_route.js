const express = require("express");
const router = express.Router();
const { signUpClinic,getAllClinicAcocount } = require("../controllers/clinic_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");

const { signUpClinicValidator } = require("../utils/validator/clinic_validator");



router.route("/").get(getAllClinicAcocount);


router.route("/").post(
  uploadImage("user").fields([
    { name: "picture", maxCount: 1 },
    { name: "professionalLicense", maxCount: 1 },
  ]),
  signUpClinicValidator,
  signUpClinic
);


module.exports = router;
