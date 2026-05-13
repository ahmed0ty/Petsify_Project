const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const ErrorAPI = require("../utils/ErrorAppi");

exports.uploadImage = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
      folder: `uploads/${folderName}`,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ErrorAPI("Only image files are allowed", 400), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

exports.removeImage = async (publicId) => {
  try {
    if (!publicId) return { message: "No image to delete" };
    await cloudinary.uploader.destroy(publicId);
    return { message: "File deleted successfully" };
  } catch (err) {
    throw { message: "Error deleting file", error: err };
  }
};