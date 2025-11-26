import React, { useEffect, useState } from "react";
import {
  Zap,
  Battery,
  Banknote,
  Clock,
  Dot,
  Wrench,
  TrendingUp
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { chargingSessionService } from "@/services/chargingSessionService";
import { pointService } from "@/services/pointService";



// Format tiền
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);

// Lấy user từ token
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const DashboardStaff = () => {
  const user = getUserFromToken();
  const stationId = user?.station_id;

  const [sessions, setSessions] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const s = await chargingSessionService.getSessionsByStation(stationId);
        const p = await pointService.getPointsByStationId(stationId);

        setSessions(s?.data || s || []);
        setPoints(p?.points || []);
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    if (stationId) loadData();
  }, [stationId]);

  // THỐNG KÊ CƠ BẢN
  const today = new Date().toISOString().split("T")[0];

  const sessionsToday = sessions.filter(
    (s) => s.start_time && s.start_time.startsWith(today)
  );

  const inProgress = sessions.filter((s) => s.status === "IN_PROGRESS").length;

  const revenueToday = sessions
    .filter((s) => s.payment_status === "paid")
    .filter((s) => s.end_time?.startsWith(today))
    .reduce((a, b) => a + (b.total_price || 0), 0);

  const pointEmpty = points.filter((p) => p.point_status === "Empty").length;
  const pointCharging = points.filter((p) => p.point_status === "Charging").length;
  const pointMaintenance = points.filter((p) => p.point_status === "Maintenance").length;

  // DATA CHO BIỂU ĐỒ

  // 1. Doanh thu 7 ngày gần nhất
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const revenueData = last7Days.map((date) => {
    const revenue = sessions
      .filter((s) => s.payment_status === "paid" && s.end_time?.startsWith(date))
      .reduce((a, b) => a + (b.total_price || 0), 0);
    
    return {
      date: new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      revenue: Math.round(revenue / 1000), // Đổi sang nghìn
    };
  });

  // 2. Số phiên theo giờ trong ngày
  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    const count = sessionsToday.filter((s) => {
      const hour = new Date(s.start_time).getHours();
      return hour === h;
    }).length;
    return { hour: `${h}h`, count };
  }).filter((d) => d.count > 0);

  // 3. Trạng thái điểm sạc
  const pointStatusData = [
    { name: "Trống", value: pointEmpty, color: "#10b981" },
    { name: "Đang sạc", value: pointCharging, color: "#f59e0b" },
    { name: "Bảo trì", value: pointMaintenance, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  // CARDS
  const stats = [
    { label: "Phiên hôm nay", value: sessionsToday.length, icon: Clock, color: "bg-blue-50" },
    { label: "Đang sạc", value: inProgress, icon: Zap, color: "bg-yellow-50" },
    { label: "Doanh thu hôm nay", value: formatCurrency(revenueToday), icon: Banknote, color: "bg-green-50" },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">


      {/* CARDS THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all`}
          >
            <div>
              <p className="text-sm text-slate-600 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-2">{item.value}</p>
            </div>
            <item.icon className="w-10 h-10 text-slate-400" />
          </div>
        ))}
      </div>

      {/* BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Doanh thu 7 ngày */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-violet-600" />
            <h2 className="font-semibold text-lg text-slate-800">Doanh thu 7 ngày</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                style={{ fontSize: 12 }}
                tick={{ fill: '#64748b' }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: 12 }}
                tick={{ fill: '#64748b' }}
                label={{ value: 'Nghìn VND', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
              />
              <Tooltip 
                formatter={(value) => [`${value}k VND`, 'Doanh thu']}
                contentStyle={{ 
                  borderRadius: 12, 
                  border: "1px solid #e2e8f0",
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5 }}
                activeDot={{ r: 7, fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trạng thái điểm sạc */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Battery className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-lg text-slate-800">Trạng thái điểm sạc</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pointStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pointStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: 12, 
                  border: "1px solid #e2e8f0",
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend tự làm */}
          <div className="flex justify-center gap-4 mt-4">
            {pointStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phiên sạc theo giờ */}
        {hourlyData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-lg text-slate-800">Phiên sạc theo giờ (hôm nay)</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#64748b" 
                  style={{ fontSize: 12 }}
                  tick={{ fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: 12 }}
                  tick={{ fill: '#64748b' }}
                  label={{ value: 'Số phiên', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} phiên`, 'Số lượng']}
                  contentStyle={{ 
                    borderRadius: 12, 
                    border: "1px solid #e2e8f0",
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* TABLE SESSIONS TODAY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-lg text-slate-800">Phiên sạc hôm nay</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Xe</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Biển số</th>
                <th className="px-6 py-3 text-center font-semibold text-slate-700">Điểm</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-700">Tiền</th>
                <th className="px-6 py-3 text-center font-semibold text-slate-700">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {sessionsToday.map((s) => (
                <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800">{s.vehicle_name}</td>
                  <td className="px-6 py-4 text-slate-800">{s.vehicle_number}</td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    Trụ #{points.find((p) => p._id === s.point_id)?.point_number}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(s.total_price || 0)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {s.payment_status === "paid" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        Chưa thanh toán
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {sessionsToday.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Không có phiên nào hôm nay
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardStaff;