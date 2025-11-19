// Thống kê cho người đùng driver 

import mongoose from "mongoose";
const UsageAnalyticsSchema=new mongoose.Schema(
    {
        date: { type: Date, required: true, index: true },
        user_id: { type: String, required: true, index: true },     // FK → User Service (store id string)
        station_id: { type: String, required: true, index: true },  // FK → Station Service
        session_count: { type: Number, default: 0 },
        total_kwh: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 }
    },
    { timestamps: true }
)
UsageAnalyticsSchema.index({date:1,station_id:1})
export default mongoose.model("UsageAnalytics", UsageAnalyticsSchema);