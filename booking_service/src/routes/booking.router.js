import express from "express";
import * as BookingController from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getAllBookings);
router.post("/validate", BookingController.validateBookingForSession);
router.get("/:id", BookingController.getBookingById);
router.get("/code/:booking_code", BookingController.getBookingByCode);
router.get("/user/:user_id", BookingController.getBookingsByUserId);
router.put("/update_status/", BookingController.updateBookingStatus);
router.post("/cancel", BookingController.cancelBooking);


export default router;
    