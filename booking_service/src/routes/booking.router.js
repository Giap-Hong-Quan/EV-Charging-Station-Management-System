import express from "express";
import { createBooking, getAllBookings, getBookingById, getBookingsByUserId, validateBookingForSession,updateBookingStatus,cancelBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.post("/validate", validateBookingForSession);
router.get("/:id", getBookingById);
router.get("/user/:user_id", getBookingsByUserId);
router.put("/update_status/", updateBookingStatus);
router.post("/cancel", cancelBooking);

export default router;
    