const GlobalError = (err, req, res, next) => {
  const statusCode = (err && err.statusCode && Number.isInteger(err.statusCode)) ? err.statusCode : 500;
  const status = err.status || (statusCode >= 400 && statusCode < 500 ? "failed" : "error");

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    return res.status(statusCode).json({
      status,
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = GlobalError;