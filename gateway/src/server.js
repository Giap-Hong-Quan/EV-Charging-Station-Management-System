import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { setupRoutes_bookings } from "./routes_bookings.js";
import { setupRoutes_station } from "./routes_station.js";
import { requestLogger, errorHandler } from "./middleware/index.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use("/api/", limiter);

// Request logging
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "API Gateway",
    timestamp: new Date().toISOString()
  });
});

// Setup API routes
setupRoutes_bookings(app);
setupRoutes_station(app);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 API routes: http://localhost:${PORT}/gateway/api/v1/*`);
});

export default app;

