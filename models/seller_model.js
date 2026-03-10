const BaseModel = require("./base_model");
const db = require("../config/db");

class sellerModel extends BaseModel {
  constructor() {
    super("seller");
  }
  async getSellerDetails(userId) {
    return await db('seller').select("*").where({ userId }).first()
  }
    getAllSellerAcocountDetails() {
    return db('seller_user_view').select("*")
  }
}

module.exports = new sellerModel();
