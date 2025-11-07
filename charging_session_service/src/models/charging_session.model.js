import mongoose from 'mongoose';

const {Schema} = mongoose;

const  ChargingSessionSchema = new Schema({
    booking_id: {
        type: Schema.Types.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    user_id: {
        type: Schema.Types.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    station_code: {
        type: String,
        required: true,
        unique: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    duartion_time: {
        type: Number,
        required: true,
    },
    start_soc_percent:{
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    end_soc_percent:{
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    total_kwh:{
        type: Number,
        required: true,
    },
    total_price:{
        type: Number,
        required: true,
    },
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},collection: 'charging_sessions'});

export default mongoose.model('ChargingSession', ChargingSessionSchema);