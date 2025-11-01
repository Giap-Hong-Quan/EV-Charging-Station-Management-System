import mongoose from "mongoose";

const maintenanceLogSchema= new mongoose.Schema(
    {
        station_id: { type: String, required: true }, // ID trạm
        point_id: { type: String, required: false }, // ID điểm sạc (nếu có)
        issue_type: { type: String, required: true }, // "Mất kết nối", "Cáp hỏng", ...
        description: { type: String },
        image_url: { type: String },
        status: {
            type: String,
            enum: ["reported", "resolved"],
            default: "reported",
        },
    },
    {
        timestamps:true,
    }
)

export default mongoose.model("MaintenanceLog", maintenanceLogSchema);
