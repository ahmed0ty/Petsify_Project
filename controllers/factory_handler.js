const ErrorAPI = require("../utils/ErrorAppi");
const asyncHandler = require("express-async-handler");

exports.createOne = (model, modelName) => {
  return asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.picture = req.file.filename;
    }
    if (req.files) {
      if(req.files.healthCertificate) {
        req.body.healthCertificate = req.files.healthCertificate?.[0]?.filename;
      }
      req.body.picture = req.files.picture?.[0]?.filename;
    }
    const result = await model.create(req.body);
    if (!result) {
      return next(new ErrorAPI(`Failed to create ${modelName}`, 401));
    }

    res.status(201).json({
      status: "success",
      message: `${modelName} created successfully`,
      id: result[0],
    });
  });
};

exports.getAll = (model, modelName) => {
  return asyncHandler(async (req, res, next) => {
    const result = await model.getAll();
    if (!result || result.length === 0) {
      throw new ErrorAPI(`No ${modelName} found`, 404);
    }
    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  });
};

exports.getOne = (model, modelName, idParam = "id") => {
  return asyncHandler(async (req, res, next) => {
    const result = await model.getById(req.params[idParam]);
    if (!result) {
      throw new ErrorAPI(`No ${modelName} found`, 404);
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
  });
};

exports.updateOne = (model, modelName, idParam = "id") => {
  return asyncHandler(async (req, res, next) => {
    if (req.file) {
      req.body.picture = req.file.filename;
    }
    const result = await model.update(req.params[idParam], req.body);
    if (!result) {
      throw new ErrorAPI(`${modelName} not updated`, 404);
    }
    res.status(200).json({
      status: "success",
      message: `${modelName} is updated`,
    });
  });
};

exports.deleteOne = (model, modelName, idParam = "id") => {
  return asyncHandler(async (req, res, next) => {
    const result = await model.delete(req.params[idParam]);

    if (!result) {
      throw new ErrorAPI(`No ${modelName} found`, 404);
    }

    res.status(200).json({
      status: "success",
      message: `${modelName} is deleted`,
    });
  });
};

exports.getName = (model, modelName) => {
  return asyncHandler(async (req, res, next) => {
    const result = await model.getByName(req.params.name);

    if (!result) {
      throw new ErrorAPI(`No ${modelName} found`, 404);
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
  });
};
