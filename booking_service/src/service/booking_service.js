import { get } from "mongoose";
import Booking from "../models/booking.model.js";

export const BookingService = {
    async createBooking(req, res) {
        try {
            const user_id = req.body.user_id || req.query.user_id;
            const station_id = req.body.station_id || req.query.station_id;
            const point_id = req.body.point_id || req.query.point_id;
            const schedule_start_time = req.body.schedule_start_time || req.query.schedule_start_time;

            // if (user_id == null) {
            //     return res.status(400).json({ message: "User need to login" });
            // }

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
                const now = new Date();
                const [hours, minutes] = schedule_start_time.split(':');
                const scheduledTime = new Date();
                scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                // Nếu giờ đã qua thì chuyển sang ngày mai
                if (scheduledTime <= now) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                }

                finalStartTime = scheduledTime;
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

            const booking = await Booking.create({
                user_id,
                station_id,
                point_id,
                schedule_start_time: finalStartTime,
            });
            return res.status(201).json({ message: "Booking created successfully", data: booking });
        } catch (error) {
            console.error("Error creating booking:", error);

            // Trả về lỗi validation cụ thể
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
};
