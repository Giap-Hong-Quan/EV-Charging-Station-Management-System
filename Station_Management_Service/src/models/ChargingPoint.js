import mongoose from "mongoose";

const chargingPointSchema=new mongoose.Schema(
    {
        station_id:{type:String,require:true},
        point_number:{type:Number,required:true,min:1},
        point_status: {
        type: String,
        enum: ["available", "busy", "maintenance"],
        default: "available",
    },
    },
    { timestamps: true }
)
// Không cho trùng point_number trong cùng 1 trạm
chargingPointSchema.index({ station_id: 1, point_number: 1 }, { unique: true });
export default mongoose.model("ChargingPoint", chargingPointSchema);