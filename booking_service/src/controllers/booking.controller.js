import Booking from "../models/booking.model.js";
import { BookingService } from "../service/booking_service.js";


// Create a new booking
export async function createBooking(req, res) {
    return BookingService.createBooking(req, res);
}

// Get all bookings
export async function getAllBookings(req, res) {
    const result = await BookingService.getAllBookings();
    return res.status(result.status).json(result);
}

// Get a booking by ID
export async function getBookingById(req, res) {
    const { id } = req.params;
    const result = await BookingService.getBookingById(id);
    return res.status(result.status).json(result);
}

// Get bookings by User ID
export async function getBookingsByUserId(req, res) {
    const { user_id } = req.params;
    const result = await BookingService.getBookingsByUserId(user_id);
    return res.status(result.status).json(result);
}   

// Validate booking for a user
export const validateBookingForSession = async (req, res) => {
    await BookingService.validateBookingForSession(req, res);
};

// Update a booking status by ID
export async function updateBookingStatus(req, res) {
    const { id, status } = req.body;
    const result = await BookingService.updateBookingStatus(id, status);
    return res.status(result.status).json(result);
}


//cancel booking
export const cancelBooking = async (req, res) => {
    const { booking_id } = req.body;
    const result = await BookingService.cancelBooking(booking_id);
    return res.status(result.status).json(result);
};
