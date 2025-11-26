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
  RefreshCw,
  Calendar,
} from "lucide-react";

import { toast } from "sonner";
import { chargingSessionService } from "@/services/chargingSessionService";
import { stationService } from "@/services/stationService";
import { pointService } from "@/services/pointService";
import SessionDetailModal from "@/components/staff/SessionDetailModal";
import CashPaymentModal from "@/components/staff/CashPaymentModal";

// =======================================================
// Helpers
// =======================================================
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

// Badge trạng thái session
const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();

  const map = {
    IN_PROGRESS: {
      label: "Đang sạc",
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    WAITING_PAYMENT: {
      label: "Chờ thanh toán",
      icon: AlertCircle,
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    },
    PAID: {
      label: "Đã thanh toán",
      icon: CheckCircle,
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-200",
    },
    COMPLETED: {
      label: "Hoàn thành",
      icon: CheckCircle,
      color: "text-slate-700",
      bg: "bg-slate-50 border-slate-200",
    },
    CANCELLED: {
      label: "Đã hủy",
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50 border-rose-200",
    },
  };

  const cfg = map[s] || map.COMPLETED;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
};

// Badge trạng thái thanh toán
const PaymentBadge = ({ payment_status, payment_method }) => {
  const st = (payment_status || "").toLowerCase();
  const method = (payment_method || "").toLowerCase();

  let label = "Chưa thanh toán";
  let bg = "bg-amber-50 border-amber-200 text-amber-700";

  if (st === "paid") {
    label = method === "cash" ? "Đã TT (Tiền mặt)" : "Đã TT (VNPAY)";
    bg = "bg-emerald-50 border-emerald-200 text-emerald-700";
  } else if (st === "failed") {
    label = "Thanh toán lỗi";
    bg = "bg-rose-50 border-rose-200 text-rose-700";
  } else if (st === "pending") {
    label = "Đang chờ thanh toán";
    bg = "bg-blue-50 border-blue-200 text-blue-700";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bg}`}
    >
      {label}
    </span>
  );
};

// =======================================================
// MAIN – SessionsAdmin
// =======================================================
const SessionsAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [enriched, setEnriched] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSession, setSelectedSession] = useState(null);
  const [showCashModal, setShowCashModal] = useState(false);
  const [cashSession, setCashSession] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("ALL");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("ALL");
  const [filterStation, setFilterStation] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Map station_id -> name để filter dropdown
  const [stationOptions, setStationOptions] = useState([]);

  // -------------------------------------------------------
  // 1. Load tất cả sessions (Admin)
  // -------------------------------------------------------
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await chargingSessionService.getAllSessions();

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.sessions)
        ? res.sessions
        : [];

      setSessions(list);
    } catch (error) {
      console.error("Error load sessions admin:", error);
      toast.error("Không tải được danh sách phiên sạc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // -------------------------------------------------------
  // 2. Join StationName + PointNumber
  // -------------------------------------------------------
  useEffect(() => {
    const joinData = async () => {
      if (!sessions.length) {
        setEnriched([]);
        setStationOptions([]);
        return;
      }

      const stationMap = {};
      const pointMap = {};

      // Load Station
      const uniqStations = [...new Set(sessions.map((s) => s.station_id))].filter(Boolean);
      await Promise.all(
        uniqStations.map(async (sid) => {
          try {
            const res = await stationService.getStationById(sid);
            stationMap[sid] = res?.name || "Không rõ trạm";
          } catch {
            stationMap[sid] = "Không rõ trạm";
          }
        })
      );

      // Load Point
      const uniqPoints = [...new Set(sessions.map((s) => s.point_id))].filter(Boolean);
      await Promise.all(
        uniqPoints.map(async (pid) => {
          try {
            const res = await pointService.getPointById(pid);
            // giả định res.point.point_number
            pointMap[pid] = res?.point?.point_number || null;
          } catch {
            pointMap[pid] = null;
          }
        })
      );

      const enrichedList = sessions.map((s) => ({
        ...s,
        station_name: stationMap[s.station_id],
        point_number: pointMap[s.point_id],
      }));

      setEnriched(enrichedList);

      // Station options cho filter
      const stationOpts = uniqStations.map((sid) => ({
        id: sid,
        name: stationMap[sid],
      }));
      setStationOptions(stationOpts);
    };

    joinData();
  }, [sessions]);

  // -------------------------------------------------------
  // 3. Filter + Search + Date range
  // -------------------------------------------------------
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm);

    const result = enriched.filter((s) => {
      const statusUpper = (s.status || "").toUpperCase();
      const payStatus = (s.payment_status || "").toLowerCase();
      const payMethod = (s.payment_method || "").toLowerCase();

      // Search text
      const textFields = [
        s.session_code,
        s.vehicle_name,
        s.vehicle_number,
        s.station_name,
        s.user_id,
      ]
        .map(removeVietnameseTones)
        .join(" ");

      const matchText = textFields.includes(keyword);

      // Status filter
      const matchStatus =
        filterStatus === "ALL" ? true : statusUpper === filterStatus;

      // PaymentStatus filter
      const matchPayStatus =
        filterPaymentStatus === "ALL"
          ? true
          : payStatus === filterPaymentStatus;

      // PaymentMethod filter
      const matchPayMethod =
        filterPaymentMethod === "ALL"
          ? true
          : payMethod === filterPaymentMethod;

      // Station filter
      const matchStation =
        filterStation === "ALL" ? true : s.station_id === filterStation;

      // Date range
      let matchDate = true;
      if (fromDate || toDate) {
        const start = s.start_time ? new Date(s.start_time) : null;
        if (!start) {
          matchDate = false;
        } else {
          const dStr = start.toISOString().slice(0, 10); // yyyy-mm-dd
          if (fromDate && dStr < fromDate) matchDate = false;
          if (toDate && dStr > toDate) matchDate = false;
        }
      }

      return (
        matchText &&
        matchStatus &&
        matchPayStatus &&
        matchPayMethod &&
        matchStation &&
        matchDate
      );
    });

    setFilteredSessions(result);
  }, [
    searchTerm,
    filterStatus,
    filterPaymentStatus,
    filterPaymentMethod,
    filterStation,
    fromDate,
    toDate,
    enriched,
  ]);

  // -------------------------------------------------------
  // 4. Kết thúc phiên (Admin có quyền)
  // -------------------------------------------------------
  const handleEndSession = async (session) => {
    try {
      toast.loading("Đang kết thúc phiên...");

      const station = await stationService.getStationById(session.station_id);

      const price = station?.price_per_kwh || 0; // VND/kWh
      const power = station?.power_rating || 7;   // kW mặc định

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

      await chargingSessionService.endSession(session._id, payload);

      toast.dismiss();
      toast.success("Đã kết thúc phiên – chờ thanh toán");

      const updated = {
        ...session,
        ...payload,
        status: "WAITING_PAYMENT",
        payment_status: session.payment_status || "pending",
      };

      setSessions((prev) =>
        prev.map((s) => (s._id === session._id ? updated : s))
      );

      setCashSession(updated); // có thể mở modal thu tiền luôn nếu muốn
      // setShowCashModal(true);

    } catch (err) {
      toast.dismiss();
      toast.error("Không thể kết thúc phiên");
      console.error(err);
    }
  };

  // -------------------------------------------------------
  // 5. Sau khi thanh toán (COD / VNPAY) – refresh
  // (Nếu muốn dùng callback từ CashPaymentModal thì bổ sung)
// -------------------------------------------------------

  const handlePaidRefetch = () => {
    fetchSessions();
  };

  // -------------------------------------------------------
  // 6. Stats cho Admin
  // -------------------------------------------------------
  const totalSessions = enriched.length;
  const inProgressCount = enriched.filter(
    (s) => (s.status || "").toUpperCase() === "IN_PROGRESS"
  ).length;
  const waitingPaymentCount = enriched.filter(
    (s) => (s.status || "").toUpperCase() === "WAITING_PAYMENT"
  ).length;
  const completedCount = enriched.filter(
    (s) => (s.status || "").toUpperCase() === "COMPLETED"
  ).length;

  const totalRevenue = enriched
    .filter((s) => (s.payment_status || "").toLowerCase() === "paid")
    .reduce((sum, s) => sum + (s.total_price || 0), 0);

  const cashRevenue = enriched
    .filter(
      (s) =>
        (s.payment_status || "").toLowerCase() === "paid" &&
        (s.payment_method || "").toLowerCase() === "cash"
    )
    .reduce((sum, s) => sum + (s.total_price || 0), 0);

  const vnpayRevenue = enriched
    .filter(
      (s) =>
        (s.payment_status || "").toLowerCase() === "paid" &&
        (s.payment_method || "").toLowerCase() === "vnpay"
    )
    .reduce((sum, s) => sum + (s.total_price || 0), 0);

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
        <p>Đang tải dữ liệu phiên sạc...</p>
      </div>
    );
  }

  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div className="p-4 md:p-6 max-w-[1700px] mx-auto font-sans space-y-6">

    

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng phiên"
          value={totalSessions}
          icon={Battery}
          className="bg-slate-50"
        />
        <StatCard
          label="Đang sạc"
          value={inProgressCount}
          icon={Zap}
          className="bg-blue-50"
        />
        <StatCard
          label="Chờ thanh toán"
          value={waitingPaymentCount}
          icon={AlertCircle}
          className="bg-amber-50"
        />
        <StatCard
          label="Đã hoàn thành"
          value={completedCount}
          icon={CheckCircle}
          className="bg-emerald-50"
        />
      </div>

      {/* REVENUE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Tổng doanh thu"
          value={formatCurrency(totalRevenue)}
          icon={Banknote}
          className="bg-green-50"
        />
        <StatCard
          label="Tiền mặt (COD)"
          value={formatCurrency(cashRevenue)}
          icon={Banknote}
          className="bg-emerald-50"
        />
        <StatCard
          label="VNPAY"
          value={formatCurrency(vnpayRevenue)}
          icon={Banknote}
          className="bg-indigo-50"
        />
      </div>

      {/* FILTERS + SEARCH */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-10 pr-3 py-2.5 border rounded-lg bg-slate-50"
              placeholder="Tìm kiếm mã phiên, biển số, xe, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 items-center">
            {/* Date range */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <input
                type="date"
                className="border rounded-lg px-2 py-1 text-xs"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="text-xs text-slate-500">→</span>
              <input
                type="date"
                className="border rounded-lg px-2 py-1 text-xs"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="px-3 py-2 border rounded-lg bg-white flex items-center gap-2 text-sm"
            >
              <Filter className="w-4 h-4" /> Bộ lọc
              <ChevronDown
                className={`w-4 h-4 transition ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {/* Refresh */}
            <button
              onClick={fetchSessions}
              className="px-3 py-2 border rounded-lg bg-emerald-50 text-emerald-700 text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilters && (
          <div className="border-b p-4 bg-slate-50 space-y-3 text-xs md:text-sm">
            {/* Hàng 1: Status + PaymentStatus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 mb-1">Trạng thái phiên</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "ALL", label: "Tất cả" },
                    { value: "IN_PROGRESS", label: "Đang sạc" },
                    { value: "WAITING_PAYMENT", label: "Chờ thanh toán" },
                    { value: "PAID", label: "Đã thanh toán" },
                    { value: "COMPLETED", label: "Hoàn thành" },
                    { value: "CANCELLED", label: "Đã hủy" },
                  ].map((st) => (
                    <button
                      key={st.value}
                      onClick={() => setFilterStatus(st.value)}
                      className={`px-2 py-1 rounded border text-xs ${
                        filterStatus === st.value
                          ? "bg-violet-600 text-white"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Trạng thái thanh toán</p>
                <select
                  className="w-full border rounded-lg px-2 py-1"
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="pending">Đang chờ</option>
                  <option value="failed">Lỗi thanh toán</option>
                </select>
              </div>
            </div>

            {/* Hàng 2: PaymentMethod + Station */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 mb-1">Phương thức thanh toán</p>
                <select
                  className="w-full border rounded-lg px-2 py-1"
                  value={filterPaymentMethod}
                  onChange={(e) => setFilterPaymentMethod(e.target.value)}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="vnpay">VNPAY</option>
                </select>
              </div>

              <div>
                <p className="text-slate-500 mb-1">Trạm</p>
                <select
                  className="w-full border rounded-lg px-2 py-1"
                  value={filterStation}
                  onChange={(e) => setFilterStation(e.target.value)}
                >
                  <option value="ALL">Tất cả trạm</option>
                  {stationOptions.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Phiên</th>
                <th className="px-6 py-3 text-left">Xe</th>
                <th className="px-6 py-3 text-left">Trạm / Trụ</th>
                <th className="px-6 py-3 text-left">Thời gian</th>
                <th className="px-6 py-3 text-right">Tiền</th>
                <th className="px-6 py-3 text-center">Trạng thái</th>
                <th className="px-6 py-3 text-center">Thanh toán</th>
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
                  {/* Phiên */}
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-violet-700 font-semibold">
                      #{s.session_code}
                    </div>
                    {s.booking_code && (
                      <div className="text-[11px] text-slate-500">
                        Booking: {s.booking_code}
                      </div>
                    )}
                  </td>

                  {/* Xe */}
                  <td className="px-6 py-4">
                    <div className="font-semibold">{s.vehicle_name}</div>
                    <div className="text-xs font-mono text-slate-600">
                      {s.vehicle_number}
                    </div>
                    {s.user_id && (
                      <div className="text-[11px] text-slate-400">
                        User: {s.user_id}
                      </div>
                    )}
                  </td>

                  {/* Trạm / Trụ */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{s.station_name}</span>
                    </div>
                    <div className="text-xs text-slate-500 pl-4">
                      Trụ #{s.point_number ?? "?"}
                    </div>
                  </td>

                  {/* Thời gian */}
                  <td className="px-6 py-4 text-xs">
                    <div className="text-slate-700">
                      {s.start_time
                        ? new Date(s.start_time).toLocaleString("vi-VN")
                        : "-"}
                    </div>
                    {s.end_time && (
                      <div className="text-slate-400">
                        → {new Date(s.end_time).toLocaleTimeString("vi-VN")}
                      </div>
                    )}
                    {s.duration_time != null && (
                      <div className="text-[11px] text-slate-400 mt-1">
                        {s.duration_time} phút
                      </div>
                    )}
                  </td>

                  {/* Tiền */}
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(s.total_price || 0)}
                    {s.total_kwh != null && (
                      <div className="text-[11px] text-slate-400">
                        {s.total_kwh.toFixed(2)} kWh
                      </div>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={s.status} />
                  </td>

                  {/* Thanh toán */}
                  <td className="px-6 py-4 text-center">
                    <PaymentBadge
                      payment_status={s.payment_status}
                      payment_method={s.payment_method}
                    />
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Xem chi tiết */}
                      <button
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(s);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Kết thúc phiên */}
                      {(s.status || "").toUpperCase() === "IN_PROGRESS" && (
                        <button
                          className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEndSession(s);
                          }}
                        >
                          Kết thúc
                        </button>
                      )}

                      {/* Thu tiền (COD) */}
                      {["WAITING_PAYMENT", "COMPLETED"].includes(
                        (s.status || "").toUpperCase()
                      ) &&
                        (s.payment_status || "").toLowerCase() !== "paid" && (
                          <button
                            className="px-3 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCashSession({
                                ...s,
                                onPaid: handlePaidRefetch,
                              });
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
                    Không tìm thấy phiên nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
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
          session={cashSession} // trong CashPaymentModal có thể dùng session.onPaid()
        />
      )}
    </div>
  );
};

// =======================================================
// StatCard phụ
// =======================================================
const StatCard = ({ label, value, icon: Icon, className = "" }) => {
  return (
    <div
      className={`p-4 rounded-xl border shadow-sm flex items-center justify-between ${className}`}
    >
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
    </div>
  );
};

export default SessionsAdmin;
