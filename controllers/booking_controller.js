const bookingModel = require("../models/booking_model");
const asyncHandler = require("express-async-handler");
const knex = require("../config/db");
const {
  createOne,
  updateOne,
  deleteOne,
} = require("./factory_handler");

const createBooking = createOne(bookingModel, "Booking");
const updateBooking = updateOne(bookingModel, "Booking");
const deleteBooking = deleteOne(bookingModel, "Booking");

const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const booking = await bookingModel.getById(id);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  await bookingModel.update(id, { status });

  res.status(200).json({
    status: "success",
    message: `Booking ${status}`,
  });
});

const getClinicBookings = asyncHandler(async (req, res, next) => {
  const { clinicId } = req.params;
  const bookings = await bookingModel.getByClinicId(clinicId);
  res.status(200).json({ success: true, data: bookings });
});

const getParentBookings = asyncHandler(async (req, res, next) => {
  const { parentId } = req.params;
  const bookings = await bookingModel.getByParentId(parentId);
  res.status(200).json({ success: true, data: bookings });
});

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
  getClinicBookings,
  getParentBookings,
};