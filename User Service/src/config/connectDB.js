const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("EVCharge", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established succesfully.");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
};

module.exports = connectDB;
