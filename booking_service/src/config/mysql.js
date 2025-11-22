import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // timezone: "+07:00",
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

try {
  await sequelize.authenticate();
  console.log("MySQL connected");
} catch (error) {
  console.error("MySQL connection failed:", error.message);
}

export default sequelize;