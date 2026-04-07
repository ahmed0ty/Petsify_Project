const express = require("express");
const router = express.Router();
const { signUpSitter, getAllSitterAcocount } = require("../controllers/sitter_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");

const { signUpSittererValidator } = require("../utils/validator/sitter_validator");

router.route("/").get(getAllSitterAcocount);
router.route("/").post(
  uploadImage("user").fields([
    { name: "picture", maxCount: 1 },
    { name: "proofOfExperience", maxCount: 1 },
  ]),
  signUpSittererValidator,
  signUpSitter
);


module.exports = router;
