const BaseModel = require("./base_model");
const db = require("../config/db");

class clinicModel extends BaseModel {
  constructor() {
    super("clinic");
  }
  async getClinicDetails(userId) {
    return await db('clinic').select("*").where({ userId }).first()
  }
  getAllClinicAcocountDetails() {
    return db('clinic_user_view').select("*")
  }
}

module.exports = new clinicModel();
