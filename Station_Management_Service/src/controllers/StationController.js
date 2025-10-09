import Station from "../models/station.js";
// create trạm 
 export const createStation =  async (req,res)=>{
    try {
        const result= await Station.create(req.body);
        res.status(201).json(result)
    } catch (error) {
        console.error("Lỗi tạo trạm",error);
        res.status(500).json({message:"Lỗi hệ thống"});
    }
 }
// get all station 
export const getAllStation = async (req, res) => {
  try {
    const result = await Station.aggregate([
      {
        $facet: {
          stations: [{ $sort: { createdAt: -1 } }],
          countAll: [
            { $count: "count" }
          ],
          countOnline: [
            { $match: { status: "online" } },
            { $count: "count" }
          ],
          countOffline: [
            { $match: { status: "offline" } },
            { $count: "count" }
          ],
          countMaintenance: [
            { $match: { status: "maintenance" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    // ✅ result là mảng có 1 phần tử duy nhất (do $facet)
    const data = result[0] || {};
    res.status(200).json({
      stations: data.stations || [],
      count: data.countAll?.[0]?.count || 0,
      countOnline: data.countOnline?.[0]?.count || 0,
      countOffline: data.countOffline?.[0]?.count || 0,
      countMaintenance: data.countMaintenance?.[0]?.count || 0,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách trạm:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// get by ai station
export const getStationById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Station.findById(id);
    !result
      ? res.status(400).json({ message: "không tìm thấy id" })
      : res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi lấy trạm", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//delete 
export const deleteStation =async (req,res) =>{
    try {
    const {id} =req.params;
    const result = await Station.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy trạm sạc để xóa" });
    }

    res.status(200).json({ message: "Đã xóa trạm sạc thành công" });
    } catch (error) {
    console.error("Lỗi xóa Station", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
//update 
export const updateStation =async (req,res)=>{
    try {
        const {id}=req.params;
        const updateData = { ...req.body };
        if (req.body.latitude && req.body.longitude) {
        updateData.location = {
            type: "Point",
            coordinates: [req.body.longitude, req.body.latitude],
        };
    }
        const result = await Station.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
        );
        if(!result){
            return res.status(404).json({ message: "Không tìm thấy trạm sạc" });
        }
        res.status(200).json(result)
    } catch (error) {
    console.error("Lỗi cập nhật trạm", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
// update status trạm 
export const updateStationStatus=async (req,res)=>{
    try {
        const {id} =req.params;
        const {status}=req.body;
        const validStatus=["online","offline","maintenance"];
        if(!status || !validStatus.includes(status)){
            return res.status(400).json({message:"Trạng thái không hợp lệ."})
        }
        const result=await Station.findByIdAndUpdate(id,{$set:{status}},{new:true});
        if (!result)
        return res.status(404).json({ message: "Không tìm thấy trạm sạc" });
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi câp nhật trạng thái trạm:", error);
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
}
//search station 
export const searchStations = async (req, res) => {
  try {
    const { keyword, connector_type, lat, lng, radius = 5000, status } = req.query;
    const filter = {};
    let stations;

    // 1️⃣ Search theo từ khóa
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [{ name: regex }, { address: regex }];
    }

    // 2️⃣ Lọc theo loại cổng (không phân biệt hoa thường)
    if (connector_type) {
      filter.connector_type = new RegExp(`^${connector_type}$`, "i");
    }

    // 3️⃣ Lọc trạng thái
    if (status) filter.status = status;

    // 4️⃣ Nếu có lat/lng thì tìm quanh vị trí
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const maxDistance = parseInt(radius);

      stations = await Station.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [longitude, latitude] },
            distanceField: "distance",
            spherical: true,
            maxDistance,
            query: filter,
          },
        },
        { $sort: { distance: 1 } },
      ]);
    } else {
      // ❗ Chỉ lọc bình thường (khi không có toạ độ)
      stations = await Station.find(filter);
    }

    res.status(200).json({
      count: stations.length,
      stations,
    });
  } catch (error) {
    console.error("Lỗi tìm kiếm trạm:", error);
    res.status(500).json({ message: error.message });
  }
};
