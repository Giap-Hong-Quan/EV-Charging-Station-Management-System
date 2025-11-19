import express from "express";
import stationRoutes from "./StationRouter.js";
import ChargingPointRoutes from "./ChargingPointRouter.js";
import MaintenanceRoutes from "./MaintenanceRouter.js"
const router = express.Router();

// ✅ mount tất cả route con tại đây
router.use("/stations", stationRoutes);
router.use("/points", ChargingPointRoutes);
router.use("/maintenance/issues", MaintenanceRoutes);
export default router;
