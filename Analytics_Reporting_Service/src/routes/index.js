import express from "express";
import UsageAnalytics from "./UsageAnalyticsRouter.js";
const router = express.Router();

router.use("/analytics", UsageAnalytics);

export default router