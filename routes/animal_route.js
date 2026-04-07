const express = require("express");
const router = express.Router();
const { createAnimal , getPetAnimalsByUserId,getMatingAnimals, getAdoptionAnimals} = require("../controllers/animal_controller");
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
router.route("/myPet/:userId").get(getPetAnimalsByUserId);
router.route("/mating").get(getMatingAnimals);
router.route("/adoption").get(getAdoptionAnimals);

module.exports = router;
