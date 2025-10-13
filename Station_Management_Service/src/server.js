import express from 'express';
import dotenv from 'dotenv';
import stationRoutes from './routes/StationRouter.js'
import ChargingPointRoutes from './routes/ChargingPointRouter.js'
import { connectDB } from './config/db.js';
import cors from "cors";
const app =express();// gọi thư viện 
dotenv.config(); // nạp file .env
app.use(express.json());
app.use(cors());
app.use('/station',stationRoutes);
app.use('/chargingPoint',ChargingPointRoutes);
const port=process.env.PORT

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Example app listening localhost:${port}`);
    })
})