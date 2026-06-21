const express = require("express");
const router = express.Router();
const {
  createAnimal,
  updateAnimal,
  getPetAnimalsByUserId,
  getMatingAnimals,
  getAdoptionAnimals,
} = require("../controllers/animal_controller");
const { uploadImage } = require("../middlewares/imageMiddleware");
const { createAnimalValidator } = require("../utils/validator/animal_validator");

router.route("/").post(
  uploadImage("animal").fields([
    { name: "picture", maxCount: 1 },
    { name: "healthCertificate", maxCount: 1 },
  ]),
  createAnimalValidator,
  createAnimal
);

// تحديث الحيوان: نحتاج middleware صغير هنا لأن updateOne في
// factory_handler.js بيتعامل مع req.file بس (ملف واحد)، مش req.files
// (ملفات متعددة بأسماء fields). الميدل وير ده بيحوّل req.files
// لنفس الشكل اللي الـ controller متوقعه في req.body.
router.route("/:id").put(
  uploadImage("animal").fields([
    { name: "picture", maxCount: 1 },
    { name: "healthCertificate", maxCount: 1 },
  ]),
  (req, res, next) => {
    if (req.files) {
      const pictureFile = req.files.picture?.[0];
      if (pictureFile) {
        req.body.picture = pictureFile.path?.startsWith("http")
          ? pictureFile.path
          : pictureFile.filename;
      }
      const certFile = req.files.healthCertificate?.[0];
      if (certFile) {
        req.body.healthCertificate = certFile.path?.startsWith("http")
          ? certFile.path
          : certFile.filename;
      }
    }
    next();
  },
  updateAnimal
);

router.route("/myPet/:userId").get(getPetAnimalsByUserId);
router.route("/mating").get(getMatingAnimals);
router.route("/adoption").get(getAdoptionAnimals);

module.exports = router;