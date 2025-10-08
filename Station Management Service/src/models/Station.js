import mongoose from "mongoose";
// Trạm sạc 
const stationSchema = new mongoose.Schema(
    {
    // Tên trạm
    name: { type: String, required: true, trim: true },
    // Địa chỉ chi tiết
    address: { type: String, trim: true },
    // Toạ độ địa lý
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    // Loại cổng sạc: CCS, AC_Type2, v.v.
    connector_type: { type: String, trim: true },
    // Công suất kW
    power_rating: { type: Number, default: 0 },
    // Tổng điểm sạc trong trạm
    total_points: { type: Number, default: 0 },
    // Số điểm còn trống
    available_points: { type: Number, default: 0 },
    // Giá điện / kWh
    price_per_kwh: { type: Number, default: 0 },
    // Trạng thái trạm
    status: {type: String,enum: ["online", "offline", "maintenance"],default: "online",},
    location: {
        type:{type:String,enum:["Point"],default:"Point"},
        coordinates: {type: [Number], required: true,},
    }
    },
    { timestamps: true }
)
stationSchema.index({ location: "2dsphere" });
// ✅ dùng pre('validate') thay vì pre('save')
stationSchema.pre("validate", function (next) {
  if (this.latitude && this.longitude) {
    this.location = {
      type: "Point",
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});

export default mongoose.model("Station",stationSchema);