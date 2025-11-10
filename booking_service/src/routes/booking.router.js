import express from "express";
import { createBooking, getAllBookings, getBookingById, getBookingsByUserId } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById); 
router.get("/user/:user_id", getBookingsByUserId);
export default router;
