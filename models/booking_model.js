const BaseModel = require("./base_model");
const db = require("../config/db");

class bookingModel extends BaseModel {
  constructor() {
    super("booking");
  }

  async getByClinicId(clinicId) {
    return await db
      .select("booking.*", "user.fullName as parentName", "user.phone as parentPhone")
      .from("booking")
      .leftJoin("user", "booking.parentId", "user.id")
      .where({ "booking.clinicId": clinicId })
      .orderBy("booking.bookingDate", "asc");
  }

  async getByParentId(parentId) {
    return await db("booking")
      .select("*")
      .where({ parentId })
      .orderBy("booking.bookingDate", "asc");
  }
}

module.exports = new bookingModel();