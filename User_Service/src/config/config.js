require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "evcharge",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: (process.env.DB_NAME || "EVCharge") + "_test",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
};
