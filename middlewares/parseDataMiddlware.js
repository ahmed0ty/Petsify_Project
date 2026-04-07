const ErrorAPI = require("../utils/ErrorAppi");
exports.parseFormDataArrays = (req, res, next) => {
  if (req.body.daysOfWeek && typeof req.body.daysOfWeek === "string") {
    try {
      req.body.daysOfWeek = JSON.parse(req.body.daysOfWeek);
    } catch (err) {
      return next(new ErrorAPI("Must be a valid JSON array.", 400));
    }
  }
  next();
};
