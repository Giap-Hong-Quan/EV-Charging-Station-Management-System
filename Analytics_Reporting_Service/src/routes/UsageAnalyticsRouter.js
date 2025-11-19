import express from "express";
import{createUsageAnalytics,userSummary,getAllAnalytics} from "../controllers/UsageAnalyticsController.js"
const router = express.Router();


router.post('/user/usage',createUsageAnalytics)
router.get('/user/summary',userSummary)

router.get("/", getAllAnalytics);
export default router;