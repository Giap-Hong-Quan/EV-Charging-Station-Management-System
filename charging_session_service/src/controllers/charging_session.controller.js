import { ChargingSessionService } from "../services/charging_session.service.js";

export const createChargingSession = async (req, res) => {
    try {
        await ChargingSessionService.createChargingSession(req, res);
    } catch (error) {
        console.error('Error in controller while creating charging session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const getAllChargingSessions = async (req, res) => {
    try {
        const sessions = await ChargingSessionService.getAllChargingSessions();
        res.status(200).json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        console.error('Error in controller while getting all charging sessions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const getChargingSessionById = async (req, res) => {
    const sessionId = req.params.id;
    try {
        const session = await ChargingSessionService.getChargingSessionById(sessionId);
        if (session) {
            res.status(200).json({
                success: true,
                data: session,
            });
        } else {
            res.status(404).json({ message: 'Charging session not found' });
        }
    } catch (error) {
        console.error('Error in controller while getting charging session by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

    