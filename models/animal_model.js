const BaseModel = require("./base_model");
const db = require("../config/db");

class animalModel extends BaseModel {
    constructor() {
        super("animal");
    }
    async getMatingAnimals() {
        return await db.select("animal.*", "user.fullName", "user.email", "user.picture as ownerPicture", "user.phone as ownerPhone")
            .from("animal")
            .leftJoin("user", "animal.userId", "user.id")
            .where("animal.type", "mating");
    }
    async getAdoptionAnimals() {
        return await db.select("animal.*", "user.fullName", "user.email", "user.picture as ownerPicture", "user.phone as ownerPhone")
            .from("animal")
            .leftJoin("user", "animal.userId", "user.id")
            .where("animal.type", "adoption");
    }
    async getAnimalByUserId(userId) {
        return await db.select("animal.*", "user.fullName", "user.email", "user.picture as ownerPicture", "user.phone as ownerPhone")
            .from("animal")
            .leftJoin("user", "animal.userId", "user.id")
            .where({ "animal.userId": userId });
    }
}

module.exports = new animalModel();
