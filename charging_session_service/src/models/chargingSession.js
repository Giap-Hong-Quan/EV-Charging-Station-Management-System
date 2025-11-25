// src/models/ChargingSession.js
import mongoose from "mongoose";
import { ChargingSessionStatus, PaymentMethod, PaymentStatus } from "../utils/constant.js";

const { Schema } = mongoose;

const ChargingSessionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },

    session_code: {
      type: String,
      required: true,
      unique: true,
    },

    booking_code: {
      type: String,
      default: null,
    },

    station_id: { type: String, required: true },
    point_id: { type: String, required: true },

    user_id: { type: String, default: null },

    vehicle_name: { type: String, required: true },
    vehicle_number: { type: String, required: true },

    start_time: { type: Date, required: true },
    end_time: { type: Date, default: null },

    duration_time: { type: Number, default: 0, min: 0 },

    start_soc_percent: { type: Number, min: 0, max: 100, default: null },
    end_soc_percent: { type: Number, min: 0, max: 100, default: null },

    total_kwh: { type: Number, default: 0, min: 0 },
    total_price: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: Object.values(ChargingSessionStatus),
      default: ChargingSessionStatus.IN_PROGRESS,
    },

    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: null,
    },

    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    transaction_id: { type: String, default: null },

    staff_operation: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "charging_sessions",
  }
);

export default mongoose.model("ChargingSession", ChargingSessionSchema);
