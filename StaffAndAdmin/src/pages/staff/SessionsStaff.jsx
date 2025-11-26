///////////////////////////////////////////////////////////////
// 📦 SESSIONS STAFF PAGE – Full Version
///////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react";
import {
  Zap,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  Eye,
  Battery,
} from "lucide-react";

import { toast } from "sonner";
import { chargingSessionService } from "@/services/chargingSessionService";
import { stationService } from "@/services/stationService";
import { pointService } from "@/services/pointService";
import SessionDetailModal from "@/components/staff/SessionDetailModal";
import CashPaymentModal from "@/components/staff/CashPaymentModal";

///////////////////////////////////////////////////////////////
// 🛠 HELPERS
///////////////////////////////////////////////////////////////
const removeVietnameseTones = (str) =>
  str
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim() || "";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

///////////////////////////////////////////////////////////////
// 🚀 MAIN COMPONENT
///////////////////////////////////////////////////////////////
const SessionsStaff = () => {
  const [sessions, setSessions] = useState([]);
  const [enriched, setEnriched] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
const [cashSession, setCashSession] = useState(null);


  const user = getUserFromToken();
  const stationId = user?.station_id;

  ///////////////////////////////////////////////////////////////
  // 1️⃣ FETCH SESSIONS
  ///////////////////////////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await chargingSessionService.getSessionsByStation(stationId);

        const list =
          Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.sessions)
            ? res.sessions
            : [];

        setSessions(list);
      } catch {
        toast.error("Không tải được phiên sạc");
      } finally {
        setLoading(false);
      }
    };

    if (stationId) load();
  }, [stationId]);

  ///////////////////////////////////////////////////////////////
  // 2️⃣ JOIN STATION NAME + POINT NAME
  ///////////////////////////////////////////////////////////////
  useEffect(() => {
    const joinData = async () => {
      if (!sessions.length) return setEnriched([]);

      const stationMap = {};
      const pointMap = {};

      await Promise.all(
        [...new Set(sessions.map((s) => s.station_id))].map(async (sid) => {
          try {
            const res = await stationService.getStationById(sid);
            stationMap[sid] = res?.name || "Không rõ trạm";
          } catch {
            stationMap[sid] = "Không rõ trạm";
          }
        })
      );

      await Promise.all(
  [...new Set(sessions.map((s) => s.point_id))].map(async (pid) => {
    try {
      const res = await pointService.getPointById(pid);
      pointMap[pid] = res?.point_number
        ? `Trụ #${res.point_number}`
        : `Trụ ???`;
    } catch {
      pointMap[pid] = "Trụ ???";
    }
  })
);


      setEnriched(
        sessions.map((s) => ({
          ...s,
          station_name: stationMap[s.station_id],
          point_name: pointMap[s.point_id],
        }))
      );
    };

    joinData();
  }, [sessions]);
// const map = {
//   in_progress: { label: "Đang sạc", icon: AlertCircle, color: "text-blue-600" },
//   waiting_payment: { label: "Chờ thanh toán", icon: Banknote, color: "text-amber-600" },
//   paid: { label: "Đã thanh toán", icon: CheckCircle, color: "text-emerald-700" },
//   completed: { label: "Hoàn thành", icon: CheckCircle, color: "text-emerald-600" },
//   cancelled: { label: "Đã hủy", icon: XCircle, color: "text-rose-600" },
// };

  ///////////////////////////////////////////////////////////////
  // 3️⃣ FILTER + SEARCH
  ///////////////////////////////////////////////////////////////
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm);

    setFilteredSessions(
      enriched.filter((s) => {
        const statusNorm = (s.status || "").toLowerCase();
        const paymentNorm = (s.payment_status || "").toLowerCase();

        const matchText = [
          s.session_code,
          s.vehicle_number,
          s.vehicle_name,
          s.station_name,
          s.point_name,
        ]
          .map(removeVietnameseTones)
          .some((x) => x.includes(keyword));

        const matchStatus = filterStatus === "all" || filterStatus === statusNorm;
        const matchPayment = filterPayment === "all" || filterPayment === paymentNorm;

        return matchText && matchStatus && matchPayment;
      })
    );
  }, [searchTerm, filterStatus, filterPayment, enriched]);

  ///////////////////////////////////////////////////////////////
  // 4️⃣ END SESSION – FULL CALCULATION
  ///////////////////////////////////////////////////////////////
 const handleEndSession = async (session) => {
  try {
    toast.loading("Đang kết thúc phiên...");

    const station = await stationService.getStationById(session.station_id);

    const price = station?.price_per_kwh || 0;
    const power = station?.power_rating || 7;

    const start = new Date(session.start_time);
    const end = new Date();

    const durationMinutes = Math.floor((end - start) / 60000);
    const durationHours = durationMinutes / 60;

    const total_kwh = Number((power * durationHours).toFixed(2));
    const batteryCapacity = 60;

    const percentIncrease = (total_kwh / batteryCapacity) * 100;
    const end_soc_percent = Math.min(
      100,
      Math.round((session.start_soc_percent || 0) + percentIncrease)
    );

    const total_price = Math.round(total_kwh * price);

    const payload = {
      end_time: end.toISOString(),
      total_kwh,
      total_price,
      end_soc_percent,
    };

    // Gọi API kết thúc phiên
    await chargingSessionService.endSession(session._id, payload);

    toast.dismiss();
    toast.success("Đã kết thúc phiên!");

    // 🔥 Tạo object session mới đúng dữ liệu
    const updatedSession = {
      ...session,
      ...payload,
      status: "completed",
      payment_status: "pending", // thêm trạng thái pending
    };

    // 🔥 Cập nhật UI
    setSessions((prev) =>
      prev.map((s) => (s._id === session._id ? updatedSession : s))
    );

    // 🔥 Mở modal thu tiền với session đã update
    setCashSession(updatedSession);
    setShowCashModal(true);

  } catch (err) {
    toast.dismiss();
    toast.error("Không thể kết thúc phiên");
    console.error(err);
  }
};


  ///////////////////////////////////////////////////////////////
  // BADGE
  ///////////////////////////////////////////////////////////////
  const getStatusBadge = (status) => {
    const map = {
      in_progress: { label: "Đang sạc", icon: AlertCircle, color: "text-blue-600" },
      completed: { label: "Hoàn thành", icon: CheckCircle, color: "text-emerald-600" },
      cancelled: { label: "Đã hủy", icon: XCircle, color: "text-rose-600" },
    };

    const c = map[status] || map.completed;
    const Icon = c.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.color}`}>
        <Icon className="w-3.5 h-3.5" /> {c.label}
      </span>
    );
  };


  // LOADING
  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );


  // RENDER

  return (
    <div className="p-4 max-w-[1600px] mx-auto font-sans">

      {/* ===================== BẢNG THỐNG KÊ ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tổng phiên", value: enriched.length, icon: Battery },
          { label: "Đang sạc", value: enriched.filter((s) => s.status.toLowerCase() === "in_progress").length, icon: Zap },
          { label: "Hoàn thành", value: enriched.filter((s) => s.status.toLowerCase() === "completed").length, icon: CheckCircle },
          {
            label: "Doanh thu",
            value: formatCurrency(
              enriched.reduce(
                (sum, s) => sum + (s.payment_status === "paid" ? s.total_price || 0 : 0),
                0
              )
            ),
            icon: Banknote,
          },
        ].map((i, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">{i.label}</p>
              <p className="text-xl font-bold">{i.value}</p>
            </div>
            <i.icon className="w-8 h-8 text-slate-500" />
          </div>
        ))}
      </div>

      {/* ===================== TABLE ===================== */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="p-4 border-b flex justify-between gap-4">

          {/* SEARCH */}
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-slate-50"
              placeholder="Tìm kiếm mã phiên, biển số…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 border rounded-lg bg-white flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Bộ lọc
            <ChevronDown className={`w-4 h-4 ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilters && (
          <div className="border-b p-4 bg-slate-50">

            {/* STATUS */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-1">Trạng thái</p>
              <div className="grid grid-cols-4 gap-2">
                {["all", "in_progress", "completed", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded border text-xs ${
                      filterStatus === st ? "bg-violet-600 text-white" : "bg-white"
                    }`}
                  >
                    {st === "all"
                      ? "Tất cả"
                      : st === "in_progress"
                      ? "Đang sạc"
                      : st === "completed"
                      ? "Hoàn thành"
                      : "Đã hủy"}
                  </button>
                ))}
              </div>
            </div>

            {/* PAYMENT */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Thanh toán</p>
              <select
                className="w-full border rounded-lg px-2 py-1 text-sm"
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chưa thanh toán</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>
        )}

        {/* LIST */}
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Xe</th>
              <th className="px-6 py-3 text-left">Trạm</th>
              <th className="px-6 py-3 text-left">Bắt đầu</th>
              <th className="px-6 py-3 text-center">Điện năng</th>
              <th className="px-6 py-3 text-right">Tiền</th>
              <th className="px-6 py-3 text-center">Trạng thái</th>
              <th className="px-6 py-3 text-center">TT</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredSessions.map((s) => (
              <tr
                key={s._id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelectedSession(s)}
              >
                <td className="px-6 py-4">
                  <div className="font-semibold">{s.vehicle_name}</div>
                  <div className="text-xs font-mono">{s.vehicle_number}</div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {s.station_name}
                  </div>
                  <div className="text-xs text-slate-500 pl-4">
                    {s.point_name}
                  </div>
                </td>

                <td className="px-6 py-4 text-xs">
                  {new Date(s.start_time).toLocaleString("vi-VN")}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {s.total_kwh?.toFixed(2) || 0} kWh
                </td>

                <td className="px-6 py-4 text-right">
                  {formatCurrency(s.total_price)}
                </td>

                <td className="px-6 py-4 text-center">{getStatusBadge(s.status)}</td>

                <td className="px-6 py-4 text-center">
                  {s.payment_status === "paid" ? (
                    <span className="text-emerald-600 font-semibold">Đã TT</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Chưa TT</span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(s);
                      }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
{/* KẾT THÚC PHIÊN */}
{s.status?.toLowerCase() === "in_progress" && (
  <button
    className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg"
    onClick={(e) => {
      e.stopPropagation();
      handleEndSession(s);
    }}
  >
    Kết thúc phiên
  </button>
)}

{/* THU TIỀN */}
{s.status?.toLowerCase() === "waiting_payment" &&
  s.payment_status?.toLowerCase() !== "paid" && (
    <button
      className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
        setCashSession(s);
        setShowCashModal(true);
      }}
    >
      Thu tiền
    </button>
)}

                  </div>
                </td>
              </tr>
            ))}

            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-500">
                  Không tìm thấy phiên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
      {showCashModal && cashSession && (
  <CashPaymentModal
    open={showCashModal}
    onOpenChange={setShowCashModal}
    session={cashSession}
  />
)}

    </div>
  );
};

export default SessionsStaff;
