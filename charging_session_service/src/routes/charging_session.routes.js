import express from "express";
import { createChargingSession, getAllChargingSessions, getChargingSessionById } from "../controllers/charging_session.controller.js";

const router = express.Router();

router.post("/create", createChargingSession);
router.get("/", getAllChargingSessions);
router.get("/session/:id", getChargingSessionById);

export default router;
