const BaseModel = require("./base_model");
const db = require("../config/db");
class orderModel extends BaseModel {
  constructor() {
    super("order");
  }
  async getOrdersForseller(sellerId) {
    return await db("pending_order_items")
      .select("*")
      .where({ sellerId })
      .orderBy("order_created_at", "desc");
}

  async getOrderDetails(orderId) {
    return await db("pending_order_items").select("*").where({"orderId": orderId}) 
}
  
}
module.exports = new orderModel();
