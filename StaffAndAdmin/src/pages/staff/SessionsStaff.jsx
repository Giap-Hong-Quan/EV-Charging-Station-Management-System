import React, { useEffect, useState } from "react";
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Battery,
  Banknote,
} from "lucide-react";

import { chargingSessionService } from "@/services/chargingSessionService";
import { stationService } from "@/services/stationService";
import { pointService } from "@/services/pointService";
import { toast } from "sonner";

// =====================================================================
// 🧹 Hàm bỏ dấu + lowercase
// =====================================================================
const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

// =====================================================================
// 🎨 Hàm format tiền VNĐ
// =====================================================================
const formatCurrency = (amount) => {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// =====================================================================
// 🎨 Hàm format thời gian (phút → h / m)
// =====================================================================
const formatDuration = (minutes) => {
  if (!minutes) return "0 phút";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} phút`;
};

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

const SessionsStaff = () => {
  const [sessions, setSessions] = useState([]);           // dữ liệu gốc từ API
  const [enriched, setEnriched] = useState([]);           // đã gắn tên trạm + điểm sạc
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const user = getUserFromToken();
  const stationId = user?.station_id;

  // =====================================================================
  // 1️⃣ Fetch sessions theo station_id (chỉ dành cho staff)
  // =====================================================================
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!stationId) {
          toast.error("Không tìm thấy station_id của nhân viên");
          setLoading(false);
          return;
        }

        setLoading(true);

        const res = await chargingSessionService.getSessionsByStation(
          stationId
        );
        // res dự kiến: { success: true, data: [...] }
        let list = [];

        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (Array.isArray(res?.sessions)) {
          list = res.sessions;
        } else {
          console.warn("Dữ liệu sessions không phải mảng:", res);
        }

        setSessions(list);
      } catch (err) {
        console.error("Lỗi fetch sessions:", err);
        toast.error("Không thể tải dữ liệu phiên sạc");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [stationId]);

  // =====================================================================
  // 2️⃣ JOIN tên trạm + tên điểm sạc
  // =====================================================================
  useEffect(() => {
    const joinStationAndPoint = async () => {
      if (!sessions || sessions.length === 0) {
        setEnriched([]);
        return;
      }

      try {
        // lấy danh sách id duy nhất
        const stationIds = [...new Set(sessions.map((s) => s.station_id))];
        const pointIds = [...new Set(sessions.map((s) => s.point_id))];

        const stationMap = {};
        for (const id of stationIds) {
          try {
            const res = await stationService.getStationById(id);
            stationMap[id] = res?.name || "Không rõ trạm";
          } catch (err) {
            console.error("Lỗi load station:", err);
            stationMap[id] = "Không rõ trạm";
          }
        }

        const pointMap = {};
        for (const pid of pointIds) {
          try {
            const res = await pointService.getPointById(pid);
            pointMap[pid] = res?.point?.name || pid || "Không rõ điểm";
          } catch (err) {
            console.error("Lỗi load point:", err);
            pointMap[pid] = pid || "Không rõ điểm";
          }
        }

        const merged = sessions.map((s) => ({
          ...s,
          station_name: stationMap[s.station_id],
          point_name: pointMap[s.point_id],
        }));

        setEnriched(merged);
      } catch (err) {
        console.error("Lỗi join station/point:", err);
      }
    };

    joinStationAndPoint();
  }, [sessions]);

  // =====================================================================
  // 3️⃣ SEARCH + FILTER LOGIC trên enriched
  // =====================================================================
  useEffect(() => {
    let temp = Array.isArray(enriched) ? [...enriched] : [];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((s) => {
      const statusNorm = (s.status || "").toLowerCase();
      const paymentNorm = (s.payment_status || "").toLowerCase();

      const fields = [
        removeVietnameseTones(s.session_code || ""),
        removeVietnameseTones(s.vehicle_number || ""),
        removeVietnameseTones(s.vehicle_name || ""),
        removeVietnameseTones(s.station_name || ""),
        removeVietnameseTones(s.point_name || ""),
        statusNorm,
        paymentNorm,
      ];

      const matchText = fields.some((f) => f.includes(keyword));

      const matchStatus =
        filterStatus === "all" ? true : statusNorm === filterStatus;

      const matchPayment =
        filterPayment === "all" ? true : paymentNorm === filterPayment;

      return matchText && matchStatus && matchPayment;
    });

    setFilteredSessions(temp);
  }, [searchTerm, filterStatus, filterPayment, enriched]);

  if (loading) return <p className="p-6">Đang tải...</p>;

  // =====================================================================
  // 📌 TÍNH TOÁN THỐNG KÊ
  // =====================================================================
  const total = enriched.length;
  const activeCount = enriched.filter(
    (s) => (s.status || "").toLowerCase() === "in_progress"
  ).length;
  const completedCount = enriched.filter(
    (s) => (s.status || "").toLowerCase() === "completed"
  ).length;
  const totalRevenue = enriched.reduce(
    (sum, s) => sum + (s.payment_status === "paid" ? (s.total_price || 0) : 0),
    0
  );

  // =====================================================================
  // 🎨 Badges
  // =====================================================================
  const getStatusBadge = (status) => {
    const norm = (status || "").toLowerCase();
    const config = {
      in_progress: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: AlertCircle,
        label: "Đang sạc",
      },
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: CheckCircle,
        label: "Hoàn thành",
      },
      cancelled: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: XCircle,
        label: "Đã hủy",
      },
    };

    const c = config[norm] || config.completed;
    const Icon = c.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
      >
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const norm = (paymentStatus || "").toLowerCase();
    const config = {
      paid: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Đã thanh toán",
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Chờ thanh toán",
      },
      failed: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        label: "Thất bại",
      },
    };

    const c = config[norm] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
      >
        {c.label}
      </span>
    );
  };

  // =====================================================================
  // RENDER UI
  // =====================================================================
  return (
    <div>
      {/* ============================
          📊 STAT CARDS
      ============================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Tổng số phiên */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-slate-600 font-medium">Tổng phiên sạc</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
            <Battery className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Đang sạc */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-blue-700 font-medium">Đang sạc</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              {activeCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-blue-200 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        {/* Hoàn thành */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-emerald-700 font-medium">Hoàn thành</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">
              {completedCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-200 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* Doanh thu */}
        <div className="bg-violet-50 p-4 rounded-xl border border-violet-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-violet-700 font-medium">Doanh thu</p>
            <p className="text-2xl font-bold text-violet-700 mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="w-11 h-11 bg-violet-200 rounded-xl flex items-center justify-center">
            <Banknote className="w-6 h-6 text-violet-700" />
          </div>
        </div>
      </div>

      {/* ============================
          🎨 SEARCH + TABLE CARD
      ============================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
        {/* 🔍 SEARCH + FILTER */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phiên, biển số, trạm, điểm sạc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* BUTTON Lọc */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100"
            >
              <Filter className="w-4 h-4" />
              Lọc
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-20">
                {/* Status */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                    Trạng thái
                  </p>
                  <div className="space-y-1">
                    {[
                      { value: "all", label: "Tất cả" },
                      { value: "in_progress", label: "Đang sạc" },
                      { value: "completed", label: "Hoàn thành" },
                      { value: "cancelled", label: "Đã hủy" },
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setFilterStatus(status.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                          filterStatus === status.value
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                    Thanh toán
                  </p>
                  <div className="space-y-1">
                    {[
                      { value: "all", label: "Tất cả" },
                      { value: "paid", label: "Đã thanh toán" },
                      { value: "pending", label: "Chờ thanh toán" },
                      { value: "failed", label: "Thất bại" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setFilterPayment(p.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                          filterPayment === p.value
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-3 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Phiên sạc
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Trạm / Điểm sạc
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Điện năng
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Chi phí
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Thanh toán
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50">
                  {/* Phiên sạc */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900 font-mono">
                        {s.session_code}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.vehicle_name} • {s.vehicle_number}
                      </p>
                    </div>
                  </td>

                  {/* Trạm / Điểm sạc */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {s.station_name || "Không rõ trạm"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Zap className="w-3 h-3" />
                        {s.point_name || s.point_id || "Không rõ điểm"}
                      </div>
                    </div>
                  </td>

                  {/* Thời gian */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {s.start_time
                          ? new Date(s.start_time).toLocaleString("vi-VN")
                          : "—"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {s.duration_time
                          ? formatDuration(s.duration_time)
                          : "Đang sạc"}
                      </div>
                    </div>
                  </td>

                  {/* Điện năng */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <p className="text-lg font-bold text-slate-900">
                        {typeof s.total_kwh === "number"
                          ? s.total_kwh.toFixed(2)
                          : "0.00"}
                      </p>
                      <p className="text-xs text-slate-500">kWh</p>
                    </div>
                  </td>

                  {/* Chi phí */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(s.total_price)}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4">{getStatusBadge(s.status)}</td>

                  {/* Thanh toán */}
                  <td className="px-6 py-4">
                    {getPaymentBadge(s.payment_status)}
                  </td>
                </tr>
              ))}

              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500">
                    Không tìm thấy phiên sạc phù hợp
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

export default SessionsStaff;
