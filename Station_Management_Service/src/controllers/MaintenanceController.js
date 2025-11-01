import cloudinary from "../config/Cloudinary.js";
import MaintenanceLog from "../models/MaintenanceLog.js";

export const createMaintenanceLog = async (req, res) => {
  try {
    const { station_id, point_id, issue_type, description } = req.body;
    if (!station_id || !point_id) {
      return res.status(404).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    let image_url = null;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "ev_charging_issues",
      });
      image_url = uploadResult.secure_url;
    }

    const result = await MaintenanceLog.create({
      station_id,
      point_id,
      issue_type,
      description,
      image_url,
    });

    res.status(201).json({
      message: "Báo cáo sự cố thành công",
      data: result,
    });
  } catch (error) {
    console.error(" Lỗi tạo sự cố:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};


// get tất cả và số lương trạng thai
export const getAllMaintenance = async (req, res) => {
  try {
    const result = await MaintenanceLog.aggregate([
      {
        $facet: {
          // Danh sách sự cố (mới nhất trước)
          maintenances: [
            { $sort: { createdAt: -1 } },
          ],
          // Tổng số tất cả sự cố
          countAll: [
            { $count: "count" },
          ],
          // Tổng số sự cố đang báo cáo
          countReported: [
            { $match: { status: "reported" } },
            { $count: "count" },
          ],
          // Tổng số sự cố đã xử lý
          countResolved: [
            { $match: { status: "resolved" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const data = result[0] || {};
    res.status(200).json({
      maintenances: data.maintenances || [],
      countAll: data.countAll?.[0]?.count || 0,
      countReported: data.countReported?.[0]?.count || 0,
      countResolved: data.countResolved?.[0]?.count || 0,
    });
  } catch (error) {
    console.error(" Lỗi lấy sự cố:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};


// get chi tiet su co 
export const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await MaintenanceLog.findById(id);
    if (!issue)
      return res.status(404).json({ message: "Không tìm thấy sự cố" });
    res.status(200).json(issue);
  } catch (error) {
    console.error(" Lỗi lấy chi tiết sự cố:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// update thong tin su co 
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "ev_charging_issues",
      });
      updateData.image_url = uploadResult.secure_url;
    }

    const updated = await MaintenanceLog.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy sự cố" });

    res.status(200).json({ message: "Cập nhật thành công", data: updated });
  } catch (error) {
    console.error(" Lỗi cập nhật sự cố:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// update trang thai 
 
export const updateMaintenanceStatus=async (req,res)=>{
    try {
        const {id} =req.params;
        const {status}=req.body;
        const validStatus=["reported", "resolved"];
        if(!status || !validStatus.includes(status)){
            return res.status(400).json({message:"Trạng thái không hợp lệ."})
        }
        const result=await MaintenanceLog.findByIdAndUpdate(id,{$set:{status}},{new:true});
        if (!result)
        return res.status(404).json({ message: "Không tìm thấy loi" });
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi câp nhật loi:", error);
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}