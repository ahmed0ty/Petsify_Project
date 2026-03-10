const animalModel = require("../models/animal_model");
const asyncHandler = require("express-async-handler");
const ErrorAPI = require("../utils/ErrorAppi");

const {
    createOne,
    deleteOne,
    updateOne,
    getOne,
    getAll,
} = require("./factory_handler");

const createAnimal = createOne(animalModel, "Animal");
const deleteAnimal = deleteOne(animalModel, "Animal");
const updateAnimal = updateOne(animalModel, "Animal");
const getAnimalById = getOne(animalModel, "Animal");
const getAllAnimals = getAll(animalModel, "Animal");


const getMatingAnimals = asyncHandler(async (req, res, next) => {
    const animals = await animalModel.getMatingAnimals();
    res.status(200).json({ success: true, data: animals });
});

const getAdoptionAnimals = asyncHandler(async (req, res, next) => {
    const animals = await animalModel.getAdoptionAnimals();
    res.status(200).json({ success: true, data: animals });
});

const getPetAnimalsByUserId = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const animals = await animalModel.getAnimalByUserId(userId);
    res.status(200).json({ success: true, data: animals });
});
module.exports = {
    getAllAnimals,
    getAnimalById,
    updateAnimal,
    createAnimal,
    deleteAnimal,
    getMatingAnimals,
    getAdoptionAnimals,
    getPetAnimalsByUserId
}