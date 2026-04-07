const BaseModel = require("./base_model");
const db = require("../config/db");
class cartModel extends BaseModel {
  constructor() {
    super("cart");
  }
  async getCartByUserId(userId) {
    return await db("cart_view").select("*").where("userId", userId)
  }
}
module.exports = new cartModel();
