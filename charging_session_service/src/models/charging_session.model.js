import mongoose from 'mongoose';
import { ChargingSessionStatus } from '../constants/session.constants';

const { Schema } = mongoose;

const ChargingSessionSchema = new Schema({

    id: {
        type: String,
        required: true,
        unique: true,
    },
    booking_id: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
     session_code: {
        type: String,
        required: true,
        unique: true,
    },
    vehicle_name: {
        type: String,
        required: true,
    },
    vehicle_number: {
        type: String,
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    duration_time: {
        type: Number,
        required: true,
        min: 0,
    },
    start_soc_percent: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    end_soc_percent: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ChargingSessionStatus),
        default: ChargingSessionStatus.IN_PROGRESS,
        required: true,
    },
    total_kwh: {
        type: Number,
        required: true,
        min: 0,
    },
    total_price: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_method: {
        type: String,
        required: true,
    },
    staff_operation: {
        type:String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    collection: 'charging_sessions'
});

export default mongoose.model('ChargingSession', ChargingSessionSchema);