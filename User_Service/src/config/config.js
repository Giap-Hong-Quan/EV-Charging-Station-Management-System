require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",  // ⬅️ Đổi DB_PASSWORD thành DB_PASS
    database: process.env.DB_NAME || "user_db",
    host: process.env.DB_HOST || "user_mysql",  // ⬅️ Cũng sửa default host
    dialect: "mysql",
    logging: console.log,  // ⬅️ Bật logging để debug
    port: process.env.DB_PORT || 3306,  // ⬅️ Thêm port
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: (process.env.DB_NAME || "user_db") + "_test",
    host: process.env.DB_HOST || "user_mysql",
    dialect: "mysql",
    logging: false,
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    port: process.env.DB_PORT || 3306,
  },
};