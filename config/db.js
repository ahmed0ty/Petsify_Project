const knex = require("knex");
const knexFile = require("../knexfile");
require("dotenv").config();

const environment = process.env.NODE_ENV || "development";
const db = knex(knexFile[environment]);

db.raw("SELECT 1")
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = db;
