const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.HOST,
      port: process.env.DATABASE_PORT || 3306,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
    migrations: {
      directory: path.resolve(__dirname, "config/migrations"),
    },
  },
  production: {
    client: "mysql",
    connection: {
      host: process.env.HOST,
      port: process.env.DATABASE_PORT || 3306,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    },
    migrations: {
      directory: path.resolve(__dirname, "config/migrations"),
    },
  },
};
