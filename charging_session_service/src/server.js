import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chargingSessionRouter from './routes/charging_session.routes.js';


dotenv.config();

async function connectDB() {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
}

async function startServer() {
    await connectDB();
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("EVCS Charging Session Service is running");
    });

    app.use("/api/v1/charging_sessions", chargingSessionRouter);
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
        console.log(`✅ Charging Session Service running on port ${PORT}`);
        console.log(`📡 API available at: http://localhost:${PORT}/api/v1/charging_sessions`);
    });
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

