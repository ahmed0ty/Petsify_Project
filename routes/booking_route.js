const express = require("express");
const router = express.Router();

const {
  createBooking,
  updateBooking,
  deleteBooking,
  getClinicBookings,
  getParentBookings,
  updateBookingStatus,
} = require("../controllers/booking_controller");

router.route("/").post(createBooking);

router.route("/clinic/:clinicId").get(getClinicBookings);

router.route("/parent/:parentId").get(getParentBookings);

router.route("/:id/status").put(updateBookingStatus);

router.route("/:id")
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;