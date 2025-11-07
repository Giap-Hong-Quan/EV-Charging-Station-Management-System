import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

try {
  await sequelize.authenticate();
  console.log("MySQL connected");
} catch (error) {
  console.error("MySQL connection failed:", error.message);
}

export default sequelize;
