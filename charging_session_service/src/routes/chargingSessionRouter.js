// src/routes/chargingSession.routes.js
import express from "express";
import { createSessionFromBooking ,createManualSession,getSessionById,getSessionsByStation,getAllSessions,getSessionsByUser,endSession,updateSessionPayment} from "../controllers/chargingSessionController.js";

const router = express.Router();

router.post("/from-booking", createSessionFromBooking);

// Tạo thủ công (staff)
router.post("/manual", createManualSession);
// Lấy theo ID
router.get("/:id",getSessionById);
// Lấy theo trạm
router.get("/station/:station_id",getSessionsByStation);

// Lấy all (optional, admin)
router.get("/", getAllSessions);
// Lấy theo user
router.get("/user/:user_id", getSessionsByUser);
// Kết thúc session
router.put("/:id/end", endSession);

// Update thanh toán
router.put("/:id/payment", updateSessionPayment);
export default router;
