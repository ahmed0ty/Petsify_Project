const express = require("express");
const router = express.Router();
const {
  getOrderById,
  deleteOrder,
  checkoutOrder,
  confirmOrder,
  orderDetails,
  getOrdersForSeller
} = require("../controllers/order_controller");
const {
  deleteOrderValidator,
  checkoutOrderValidator,
} = require("../utils/validator/order_validator");


router.post("/checkout",checkoutOrderValidator,checkoutOrder);
router.get("/seller/:sellerId", getOrdersForSeller);
router.get("/details/:id", orderDetails);
router
  .route("/id/:id")
  .get(getOrderById)
  .delete(deleteOrderValidator, deleteOrder);
router.route("/accept/:orderId").post(confirmOrder)

module.exports = router;
