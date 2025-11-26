import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { setupRoutes_user } from "./routes/user.js";
import { setupRoutes_station } from "./routes/station.js";
import { setupRoutes_booking } from "./routes/booking.js";
import { setupRoutes_analytics } from "./routes/analytics.js";
import { config } from "./config.js";
import { setupRoutes_session } from "./routes/session.js";
import { setupRoutes_payment } from "./routes/payment.js";

const app = express();

// Không parse body trước khi vào proxy
app.use("/gateway", (req, res, next) => {
  next();  // chuyển thẳng vào proxy
});

// Các middleware không đụng body
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// ==== PROXY ROUTES (phải đặt TRƯỚC express.json) ====
setupRoutes_user(app);
setupRoutes_station(app);
setupRoutes_booking(app);
setupRoutes_analytics(app);
setupRoutes_session(app);
setupRoutes_payment(app);

// ==== Parse body cho các route KHÁC gateway ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 Gateway running on port ${config.port}`);
});

export default app;
