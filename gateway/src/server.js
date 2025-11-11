import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { setupRoutes_user } from "./routes/user.js";
import { setupRoutes_station } from "./routes/station.js";
import { setupRoutes_booking } from "./routes/booking.js";
import { setupRoutes_analytics } from "./routes/analytics.js";

const app = express();

// Middleware cơ bản
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check TRƯỚC rate limit và proxy
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "API Gateway",
    timestamp: new Date().toISOString()
  });
});

// Rate limiting CHỈ cho /gateway/*
app.use("/gateway", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

// ⚠️ QUAN TRỌNG: Setup proxy routes NGAY SAU rate limit
setupRoutes_station(app);
setupRoutes_user(app);
setupRoutes_booking(app);
setupRoutes_analytics(app);

// 404 handler - bắt tất cả routes không match
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Gateway Error:", err.message);
  res.status(err.status || 500).json({ 
    error: "Internal Server Error",
    message: err.message 
  });
});

const PORT = config.port;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Gateway running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
});

export default app;