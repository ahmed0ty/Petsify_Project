const express = require("express");
const router = express.Router();
const { createProduct , getPetProductsBySellerId, getAllProducts} = require("../controllers/product_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");
const { createProductValidator } = require("../utils/validator/product_validator");



router.route("/").get(getAllProducts)
router.route("/").post(
  uploadImage("product").fields([
    { name: "picture", maxCount: 1 },
  ]),
  createProductValidator,
  createProduct
);
router.route("/seller/:sellerId").get(getPetProductsBySellerId);

module.exports = router;
