import mongoose from "mongoose";

export const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING)
        console.log("Kết nối cơ sở dữ liệu thành công ")
    } catch (error) {
        console.log("Kết nối cơ cở dữ liệu thất bại",error)
        process.exit(1); // thoát app nếu DB fail
    }
}