const BaseModel = require("./base_model");
const db = require("../config/db");

class sitterModel extends BaseModel {
  constructor() {
    super("sitter");
  }
  async getSitterDetails(userId){
    return await db('sitter').select("*").where({userId}).first()
  }

  getAllSitterAcocountDetails() {
    return db('sitter_user_view').select("*")
  }
}

module.exports = new sitterModel();
