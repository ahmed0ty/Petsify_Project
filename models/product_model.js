const BaseModel = require("./base_model");
const db = require("../config/db");

class productModel extends BaseModel {
  constructor() {
    super("product");
  }
    async getProductBySellerId(sellerId) {
        return await db.select("*").from("product").where({sellerId});
    }
}

module.exports = new productModel();
