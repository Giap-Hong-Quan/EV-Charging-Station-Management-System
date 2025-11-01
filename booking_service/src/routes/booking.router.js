import express from "express";
import { createBooking, getAllBookings, getBookingById } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById); 
router.delete("/delete/:id", (req, res) => {
    return res.status(200).json({ message: "Booking deleted successfully" });
});
export default router;
