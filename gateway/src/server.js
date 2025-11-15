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

// ✅ Tăng timeout cho Express
app.use((req, res, next) => {
  req.setTimeout(60000); // 60 seconds
  res.setTimeout(60000);
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "API Gateway",
    timestamp: new Date().toISOString()
  });
});

// Rate limit
app.use(
  "/gateway",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

// Load proxy routes
setupRoutes_station(app);
setupRoutes_user(app);
setupRoutes_booking(app);
setupRoutes_analytics(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Gateway Error:", err);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// ✅ Tạo server với timeout setting
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`🚀 Gateway running on port ${config.port}`);
});

// ✅ Set timeout cho server
server.timeout = 60000; // 60 seconds
server.keepAliveTimeout = 60000;
server.headersTimeout = 61000; // Slightly higher than keepAliveTimeout

export default app;