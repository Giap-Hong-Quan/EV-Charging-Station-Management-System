
export const ChargingSessionService = {

    async createChargingSession(req, res) {
        try {
            const {booking_code, vehicle_name, vehicle_number, schedule_start_time} = req.body;
            if (process.env.API_VALIDATE_BOOKING_FOR_SESSION) {
                const validateUrl = process.env.API_VALIDATE_BOOKING_FOR_SESSION;
                const bookingValidationResponse = await fetch(validateUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ booking_code: booking_code,
                        vehicle_name: vehicle_name,
                        vehicle_number: vehicle_number,
                        schedule_start_time: schedule_start_time,
                     }),
                });
                const validationResult = await bookingValidationResponse.json();

                if (!bookingValidationResponse.ok || !validationResult.valid) {
                    return res.status(400).json({
                        success: false,
                        message:
                            validationResult.message ||
                            "Booking validation failed before creating session",
                    });
                }
                const newSession = new ChargingSession({
                    booking_code: booking_code,
                    session_code: generateUniqueSessionCode(),
                    vehicle_name: vehicle_name,
                    vehicle_number: vehicle_number,
                    start_time: validationResult.schedule_start_time,
                    end_time: null,
                    duration_time: 0,
                    start_soc_percent: 20,
                    end_soc_percent: 100,
                    status: ChargingSessionStatus.IN_PROGRESS,
                    total_kwh: 0,
                    total_price: 0, 
                    payment_method: null,
                });
                const savedSession = await newSession.save();
                return res.status(201).json({
                    success: true,
                    data: savedSession,
                }); 
            }
        } catch (error) {
            console.error('Error creating charging session:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getChargingSessionById(sessionId) {
        // Implementation for retrieving a charging session by ID
    }


};