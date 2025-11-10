import "dotenv/config.js";

export const config = {
  port: process.env.GATEWAY_PORT || 3000,
  bookingService: {
    baseUrl: process.env.BOOKING_SERVICE_URL,
  },
  stationService: {
    baseUrl: process.env.STATION_SERVICE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

