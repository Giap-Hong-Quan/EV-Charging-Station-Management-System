import Station from "../models/station.js";
// create trạm 
 export const createStation =  async (req,res)=>{
    try {
        const result= await Station.create(req.body);
        res.status(201).json(result)
    } catch (error) {
        console.error("Lỗi tạo Station",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
 }
// get all station 
export const getAllStation= async (req,res)=>{
    try {
        const result=await Station.find();
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi lấy Station",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
}