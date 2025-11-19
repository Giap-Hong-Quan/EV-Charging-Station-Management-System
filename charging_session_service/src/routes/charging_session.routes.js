import express from "express";
import { createChargingSession } from "../controllers/charging_session.controller.js";

const router = express.Router();

router.post("/create", createChargingSession);

export default router;
