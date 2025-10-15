import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./route/web.js";
import db from "./models/index.js";
import dotenv from "dotenv";

dotenv.config();

let app = express();

// CORS middleware
app.use(function (req, res, next) {
  // Cho phép domain React truy cập API
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.URL_REACT || "http://localhost:3000"
  );

  // Cho phép các phương thức HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Cho phép các header
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );

  // Cho phép gửi cookie
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Xử lý preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Kết nối database
const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database (trong development)
    await db.sequelize.sync({ alter: true });
    console.log(" Database synced successfully.");
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
    process.exit(1);
  }
};

// Khởi tạo routes
initWebRoutes(app);

let port = process.env.PORT || 8082;

// Khởi động máy chủ với database connection
const startServer = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Khởi động server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Khởi động server
startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    errCode: 1,
    errMessage: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    errCode: 1,
    errMessage: "Endpoint not found",
  });
});

export default app;
