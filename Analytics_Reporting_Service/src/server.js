import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from "./routes/index.js"; // import router gốc
import cors from "cors";
const app =express();// gọi thư viện 
dotenv.config(); // nạp file .env
app.use(express.json()); // đọc JSON
app.use(express.urlencoded({ extended: true })); // đọc form text
app.use(cors());
// ✅ chỉ cần khai báo 1 lần
app.use("/api/v1", apiRoutes);
const port=process.env.PORT

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Example app listening localhost:${port}`);
    })
})