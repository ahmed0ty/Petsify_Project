const bookingModel = require("../models/booking_model");
const asyncHandler = require("express-async-handler");
const {
  createOne,
  updateOne,
  deleteOne,
} = require("./factory_handler");

const createBooking = createOne(bookingModel, "Booking");
const updateBooking = updateOne(bookingModel, "Booking");
const deleteBooking = deleteOne(bookingModel, "Booking");

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
  getClinicBookings,
  getParentBookings,
};