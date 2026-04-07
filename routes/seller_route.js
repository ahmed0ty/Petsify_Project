const express = require("express");
const router = express.Router();
const { signUpSeller,getAllSellerAcocount } = require("../controllers/seller_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");

const { signUpSellerValidator } = require("../utils/validator/seller_validator");



router.route("/").get(getAllSellerAcocount);
router.route("/").post(
  uploadImage("user").fields([
    { name: "picture", maxCount: 1 },
    { name: "proofOfBusiness", maxCount: 1 },
  ]),
  signUpSellerValidator,
  signUpSeller
);


module.exports = router;
