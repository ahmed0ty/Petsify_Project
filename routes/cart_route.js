const express = require("express");
const router = express.Router();
const {
  createCart,
  getAllCarts,
  deleteCart,
  getCartForUser,
  incrementNumberOfProduct,
  decrementNumberOfProduct
} = require("../controllers/cart_controller");
const {
  createCartValidator,
  deleteCartValidator,
  incrementDecrementValidator,
} = require("../utils/validator/cart_validator");


router.route("/user/:userId").get(getCartForUser);
router.route("/").post(createCartValidator, createCart).get(getAllCarts);
router.route("/increment").put(incrementDecrementValidator,incrementNumberOfProduct);
router.route("/decrement").put(incrementDecrementValidator,decrementNumberOfProduct);

router
.route("/:id")
.delete(deleteCartValidator, deleteCart);

module.exports = router;
