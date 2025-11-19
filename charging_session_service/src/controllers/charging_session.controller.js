import { ChargingSessionService } from "../services/charging_session.service.js";

export const createChargingSession = async (req, res) => 
    ChargingSessionService.createChargingSession(req, res);

    