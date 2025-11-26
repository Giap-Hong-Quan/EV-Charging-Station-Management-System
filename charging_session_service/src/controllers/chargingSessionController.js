// src/controllers/chargingSessionController.js
import { ChargingSessionService } from "../services/chargingSessionService.js";

export const createSessionFromBooking = (req, res) =>
  ChargingSessionService.createSession(req, res);
export const createManualSession = (req, res) =>
  ChargingSessionService.createManual(req, res);
export const getSessionById = (req, res) =>
  ChargingSessionService.getById(req, res);
export const getSessionsByStation = (req, res) =>
  ChargingSessionService.getByStation(req, res);
export const getAllSessions = (req, res) =>
  ChargingSessionService.getAll(req, res);

export const getSessionsByUser = (req, res) =>
  ChargingSessionService.getByUser(req, res);
export const endSession = (req, res) =>
  ChargingSessionService.endSession(req, res);

export const updateSessionPayment = (req, res) =>
  ChargingSessionService.updatePayment(req, res);
