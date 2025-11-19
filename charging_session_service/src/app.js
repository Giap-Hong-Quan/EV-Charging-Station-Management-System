import express from "express";

const app = express();
app.use(express.json());

app.use("/api/v1/charging_sessions", chargingSessionRouter);

export default app;
