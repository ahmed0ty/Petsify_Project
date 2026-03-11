const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

module.exports = {
  development: {
    client: "mysql2",
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
    client: "mysql2",
    connection: {
      host: process.env.HOST,
      port: process.env.DATABASE_PORT || 3306,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      ssl: process.env.DB_CA_CERT
        ? {
            rejectUnauthorized: true,
            ca: process.env.DB_CA_CERT,
          }
        : { rejectUnauthorized: false }, // fallback لو ما عندكش CA
    },
    migrations: {
      directory: path.resolve(__dirname, "config/migrations"),
    },
  },
};