import ChargingPoint from "../models/ChargingPoint.js";

// create điểm sạc 

export const createChargingPoint= async (req,res) =>{
    try {
        const { station_id, point_number, point_status } = req.body;
        if (!station_id || !point_number) {
        return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
        }
        const result = await ChargingPoint.create({
      station_id,
      point_number,
      point_status,
    })
     res.status(201).json(result)
    } catch (error) {
        console.error("Lỗi tạo điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
}

//get all charging point 
 export const getAllChargingPoint = async (req,res) =>{
    try {
        const result = await ChargingPoint.find();
        res.status(200).json(result)
    } catch (error) {
        console.error("Lỗi lấy tất cả điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
 }
 ///get chargingpoint by id trạm
 export const getChargingPoint =async (req,res)=>{
    try {
        const {id} =req.params;
        const result =await ChargingPoint.findById(id)
        if(!result) return res.status(400).json({message:"Không tìm thấy điểm sạc"});
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi lấy điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
 }

//  update chargingpoint 
export const updateChargingPoint= async (req,res)=>{
    try {
        const {id} =req.params;
        const result =await ChargingPoint.findByIdAndUpdate(id,req.body,{new:true});
        if(!result) return res.status(400).json({message:"Không tìm thấy điểm sạc"});
        res.status(200).json(result)
    } catch (error) {
        console.error("Lỗi cập nhật điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
}

//xóa điểm sạc 
export const deleteChargingPoint =async (req,res) =>{
    try {
        const {id} =req.params;
        const result =await ChargingPoint.findByIdAndDelete(id);
        if(!result) return res.status(400).json({message:"Không tìm thấy điểm sạc"});
        res.status(200).json({message:"Xóa điểm sạc thành công"});
    } catch (error) {
        console.error("Lỗi xóa điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
}

// câp nhật trạng thái điểm sạc
 export const updateChargingPointStatus=async (req,res)=>{
    try {
        const {id} =req.params;
        const { point_status } = req.body;
        const validStatus=["Empty", "Charging", "Maintenance","Reservation"];
        if(!point_status || !validStatus.includes(point_status)){
            return res.status(400).json({message:"Trạng thái không hợp lệ."})
        }
        const result=await ChargingPoint.findByIdAndUpdate(id,{$set:{point_status}},{new:true});
        if (!result)
        return res.status(404).json({ message: "Không tìm thấy trạm sạc" });
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi cập nhật điểm sạc",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
 }

 // get tất cả theo trạm 
export const getPointsByStationId =async (req,res)=>{
  try {
    const { stationId } = req.params;
    const points = await ChargingPoint.find({ station_id: stationId });
        if (!points.length)
      return res
        .status(404)
        .json({ message: "Không tìm thấy điểm sạc cho trạm này" });

    res.status(200).json({ count: points.length, points });

  } catch (error) {
    console.error("Lỗi lấy điểm sạc theo trạm ",error);
    res.status(500).json({message:"Lỗi hệ thống"});
  }
}