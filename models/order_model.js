const BaseModel = require("./base_model");
const db = require("../config/db");
class orderModel extends BaseModel {
  constructor() {
    super("order");
  }
  async getOrdersForseller(sellerId) {
    return await db("pending_order_items").select("*").where({sellerId}).groupBy("orderId").orderBy("order_created_at", "desc");
  }

  async getOrderDetails(orderId) {
    return await db("pending_order_items").select("*").where({"order_id": orderId}) 
    
  }
  
}
module.exports = new orderModel();
