const { validationResult } = require("express-validator");
const ErrorAPI = require("../utils/ErrorAppi"); // adjust path if needed

exports.runValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const firstError = result.array()[0];
  return next(new ErrorAPI(firstError.msg, 400));
};
