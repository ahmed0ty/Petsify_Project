const db = require("../config/db");

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }
  async create(data) {
    return await db(this.tableName).insert(data);
  }
  async getById(id) {
    return await db(this.tableName).where({ id }).first();
  }
  async getAll() {
    return await db(this.tableName).select("*");
  }
  async update(id, data) {
    return await db(this.tableName).where({ id }).update(data);
  }
  async delete(id) {
    return await db(this.tableName).where({ id }).del();
  }
}

module.exports = BaseModel;
