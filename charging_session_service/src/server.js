// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chargingSessionRouter from "./routes/chargingSessionRouter.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB ONE TIME ONLY
connectDB();

// Routes
app.use("/api/v1/sessions", chargingSessionRouter);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Charging Session Service running on ${PORT}`);
});
