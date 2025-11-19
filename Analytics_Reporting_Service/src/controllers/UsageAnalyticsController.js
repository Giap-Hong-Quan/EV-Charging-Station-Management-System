import UsageAnalytics from "../models/UsageAnalytics.js";
import { parseRange } from "../utils/date.js";
// tóm tắt sử dụng của người dùng 
export const userSummary = async (req,res)=>{
    try {
    const {userId}=req.query;   // nhân id từ url
    if(!userId) return res.status(400).json({error:"Không tìm thấy userid"});
     const { start, end } = parseRange(req.query); // nhân date từ url
      const [agg] = await UsageAnalytics.aggregate([
      { $match: { user_id: userId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: "$session_count" },
          totalKwh: { $sum: "$total_kwh" },
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]);

    res.json({
      user_id: userId,
      range: { from: start, to: end },
      total_sessions: agg?.totalSessions || 0,
      total_kwh: agg?.totalKwh || 0,
      total_revenue: agg?.totalRevenue || 0
    });
    } catch (error) {
        console.error({message:"Không tìm thấy ",error})
        res.status(500).json({ error: e.message });

    }
}

// tạo phân tich 

export const createUsageAnalytics =async (req,res) =>{
    try {
        const data = req.body;
        if (!data.user_id || !data.station_id || !data.date)
            return res.status(400).json({ error: "Thiếu user_id / station_id / date" });
        const result = await UsageAnalytics.findOne({
            user_id: data.user_id,
            station_id: data.station_id,
            date: data.date
        });
        if (result) {
            result.session_count += data.session_count || 0;
            result.total_kwh += data.total_kwh || 0;
            result.revenue += data.revenue || 0;
            await result.save();
            return res.json({ message: "✅Cập nhật dữ liệu thành công", data: result });
        } else {
        const created = await UsageAnalytics.create(data);
        return res.json({ message: "Thêm bản ghi mới", data: created });
        }
    } catch (error) {
        console.error({message:"Không tìm thấy ",error})
        res.status(500).json({ error: e.message });
    }
}

export async function getAllAnalytics(req, res) {
  try {
    const data = await UsageAnalytics.find().sort({ date: -1 });
    res.status(200).json({
      count: data.length,
      data
    });
  } catch (error) {
    console.error("❌ Lỗi lấy analytics:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
}