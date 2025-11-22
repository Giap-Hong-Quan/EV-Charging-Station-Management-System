import { get } from "mongoose";
import Booking from "../models/booking.model.js";
import crypto from "crypto";
import { BOOKING_STATUS } from "../constants/booking.constant.js";

export const BookingService = {
    async createBooking(req, res) {
        try {
            const user_id = req.body.user_id || req.query.user_id;
            const station_id = req.body.station_id || req.query.station_id;
            const point_id = req.body.point_id || req.query.point_id;
            const schedule_start_time = req.body.schedule_start_time || req.query.schedule_start_time;

            if (!station_id) {
                return res.status(400).json({ message: "Station ID is required" });
            }

            if (!point_id) {
                return res.status(400).json({ message: "Point ID is required" });
            }

            if (!schedule_start_time) {
                return res.status(400).json({ message: "Schedule start time is required" });
            }

            let finalStartTime;
            if (/^\d{2}:\d{2}$/.test(schedule_start_time)) {
                // Tạo datetime theo múi giờ Việt Nam (UTC+7)
                const now = new Date();
                const [hours, minutes] = schedule_start_time.split(':');

                // Tạo date object với giờ Việt Nam
                const vietnamTime = new Date();
                vietnamTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                // Chuyển sang UTC (trừ 7 giờ)
                const utcTime = new Date(vietnamTime.getTime());

                // Nếu giờ đã qua thì chuyển sang ngày mai
                if (utcTime <= now) {
                    utcTime.setDate(utcTime.getDate() + 1);
                }

                finalStartTime = utcTime;
            }
            else {
                finalStartTime = new Date(schedule_start_time);

                // Kiểm tra nếu thời gian trong quá khứ
                if (finalStartTime <= new Date()) {
                    return res.status(400).json({
                        message: "Schedule start time must be in the future"
                    });
                }
            }
            console.log("Final start time (UTC):", finalStartTime);
            console.log("Final start time (Local):", new Date(finalStartTime.getTime() + 7 * 60 * 60 * 1000));

            const booking_code = await this.generateUniqueBookingCode();

            const booking = await Booking.create({
                booking_code,
                user_id,
                vehicle_name: req.body.vehicle_name,
                vehicle_number: req.body.vehicle_number,
                station_id,
                point_id,
                schedule_start_time: finalStartTime,
            });
            return res.status(201).json({ message: "Booking created successfully", data: booking });
        } catch (error) {
            console.error("Error creating booking:", error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: error.errors[0].message
                });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    },


    async getAllBookings() {
        try {
            const bookings = await Booking.findAll();
            if (!bookings || bookings.length === 0) {
                return { status: 404, message: "No bookings found", data: [] };
            }
            return { status: 200, message: "Bookings fetched successfully", count: bookings.length, data: bookings };
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return { status: 500, message: "Internal server error" };
        }
    },


    async getBookingById(id) {
        try {
            const booking = await Booking.findByPk(id);
            if (!booking) {
                return { status: 404, message: "Booking not found" };
            }
            return { status: 200, message: "Booking fetched successfully", data: booking };
        } catch (error) {
            console.error("Error fetching booking by ID:", error);
            return { status: 500, message: "Internal server error" };
        }

    },

    async getBookingsByUserId(user_id) {
        try {
            const bookings = await Booking.findAll({ where: { user_id } });
            if (!bookings || bookings.length === 0) {
                return { status: 404, message: "No bookings found for this user", data: [] };
            }
            return { status: 200, message: "Bookings fetched successfully", data: bookings };
        } catch (error) {
            console.error("Error fetching bookings by user ID:", error);
            return { status: 500, message: "Internal server error" };
        }
    },


    async generateUniqueBookingCode() {
        let booking_code;
        let isUnique = false;

        while (!isUnique) {
            // Format: BK-YYYYMMDD-RANDOM6
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const random = crypto.randomBytes(3).toString('hex').toUpperCase();
            booking_code = `BK-${date}-${random}`;

            // Check if code already exists
            const existing = await Booking.findOne({ where: { booking_code } });
            if (!existing) {
                isUnique = true;
            }
        }

        return booking_code;
    },

    async validateBookingForSession(req, res) {
        try {
            const {
                booking_code,
                vehicle_name,
                vehicle_number,
                schedule_start_time
            } = req.body;

            // Validate input
            if (!booking_code?.trim()) {
                return res.status(400).json({
                    valid: false,
                    message: "Booking code is required"
                });
            }

            if (!vehicle_name?.trim()) {
                return res.status(400).json({
                    valid: false,
                    message: "Vehicle name is required"
                });
            }

            if (!vehicle_number?.trim()) {
                return res.status(400).json({
                    valid: false,
                    message: "Vehicle number is required"
                });
            }

            if (!schedule_start_time?.trim()) {
                return res.status(400).json({
                    valid: false,
                    message: "Schedule start time is required"
                });
            }

            // Query booking
            const booking = await Booking.findOne({
                where: { booking_code }
            });

            if (!booking) {
                return res.status(404).json({
                    valid: false,
                    message: "Booking not found"
                });
            }

            // Validate vehicle name
            if (booking.vehicle_name !== vehicle_name) {
                return res.status(403).json({
                    valid: false,
                    message: "Vehicle name does not match the booking"
                });
            }

            // Validate vehicle number
            if (booking.vehicle_number !== vehicle_number) {
                return res.status(403).json({
                    valid: false,
                    message: "Vehicle number does not match the booking",
                    booking_vehicle_number: booking.vehicle_number
                });
            }

            // Validate schedule start time
            const clientStart = new Date(schedule_start_time);
            const bookingStart = new Date(booking.schedule_start_time);

            if (clientStart.getTime() !== bookingStart.getTime()) {
                return res.status(403).json({
                    valid: false,
                    message: "Schedule start time does not match the booking",
                    expected: bookingStart,
                    received: clientStart
                });
            }

            // Check booking status
            if (booking.status === 'CANCELLED') {
                return res.status(400).json({
                    valid: false,
                    message: "Booking has been cancelled"
                });
            }

            if (booking.status === 'COMPLETE') {
                return res.status(400).json({
                    valid: false,
                    message: "Booking already completed"
                });
            }

            // Time validation (± 15 mins)
            const now = new Date();
            const endTime = new Date(booking.schedule_end_time);
            const bufferMin = 15;

            if (now < new Date(bookingStart.getTime() - bufferMin * 60000)) {
                return res.status(400).json({
                    valid: false,
                    message: `Too early. Booking starts at ${bookingStart.toISOString()}`,
                    current_time: now
                });
            }

            if (now > new Date(endTime.getTime() + bufferMin * 60000)) {
                return res.status(400).json({
                    valid: false,
                    message: "Booking time expired",
                    scheduled_end_time: endTime,
                    current_time: now
                });
            }

            // Success
            return res.status(200).json({
                valid: true,
                message: "Booking is valid. You can start charging.",
                data: {
                    booking_id: booking.id,
                    booking_code: booking.booking_code,
                    user_id: booking.user_id,
                    station_id: booking.station_id,
                    point_id: booking.point_id,
                    vehicle_name: booking.vehicle_name,
                    vehicle_number: booking.vehicle_number,
                    schedule_start_time: booking.schedule_start_time,
                    schedule_end_time: booking.schedule_end_time,
                    status: booking.status,
                    created_at: booking.createdAt
                }
            });

        } catch (error) {
            console.error("Error validating booking:", error);
            return res.status(500).json({
                valid: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },


    async cancelBooking(booking_id) {
        try {
            console.log("Cancel booking ID:", booking_id);  // Debug log

            const booking = await Booking.findByPk(booking_id);

            if (!booking) {
                return { status: 404, message: "Booking not found" };
            }

            console.log("Current booking status:", booking.status);  // Debug log

            // Kiểm tra booking đã bị cancel chưa
            if (booking.status === BOOKING_STATUS.CANCELLED) {
                return { status: 400, message: "Booking is already cancelled" };
            }

            // Kiểm tra booking đã hoàn thành chưa
            if (booking.status === BOOKING_STATUS.COMPLETE) {
                return { status: 400, message: "Cannot cancel completed booking" };
            }

            booking.status = BOOKING_STATUS.CANCELLED;
            booking.cancelled_at = new Date();
            await booking.save();

            return {
                status: 200,
                message: "Booking cancelled successfully",
                data: booking
            };
        } catch (error) {
            console.error("Error cancelling booking:", error);
            return {
                status: 500,
                message: "Internal server error",
                error: error.message
            };
        }
    },

    async getBookingByBookingCode(booking_code) {
        try {
            const booking = await Booking.findOne({ where: { booking_code } });
            if (!booking) {
                return { status: 404, message: "Booking not found" };
            }
            return { status: 200, message: "Booking fetched successfully", data: booking };
        } catch (error) {
            console.error("Error fetching booking by code:", error);
            return { status: 500, message: "Internal server error" };
        }
    },

};
