const BaseModel = require("./base_model");
const db = require("../config/db");

class userModel extends BaseModel {
  constructor() {
    super("user");
  }
  async getByEmail(email) {
    return db(this.tableName).where({ email }).first();
  }
  async getByPhone(phone) {
    return db(this.tableName).where({ phone }).first();
  }
  async verifyCode(data) {
    return db(this.tableName).where(data).first();
  }
}

module.exports = new userModel();
