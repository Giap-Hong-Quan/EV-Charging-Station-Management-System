import "dotenv/config.js";
import express from "express";
import bookingRouter from "./routes/booking.router.js";
import sequelize from "./config/mysql.js";

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully.");

    await sequelize.sync(); // Ensure all models are synced
    console.log("MySQL tables synced.");

    const app = express();
    app.use(express.json());

    // Root check route
    app.get("/", (req, res) => {
      res.send("EVCS Booking Service is running");
    });

    // Main API routes
    app.use("/api/v1/bookings", bookingRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Booking Service running on port ${PORT}`);
      console.log(`📡 API available at: http://localhost:${PORT}/api/v1/bookings`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
