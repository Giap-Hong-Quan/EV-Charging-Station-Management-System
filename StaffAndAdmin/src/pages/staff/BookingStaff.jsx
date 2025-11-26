import React, { useEffect, useState } from "react";
import {
  Zap,
  Battery,
  Banknote,
  Clock,
  Calendar,
  Car,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Dot,
} from "lucide-react";

import { chargingSessionService } from "@/services/chargingSessionService";
import { pointService } from "@/services/pointService";
import { bookingService } from "@/services/bookingService";

// Format tiền
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount || 0
  );

// Decode token
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Badge Booking
const BookingBadge = ({ status }) => {
  const STATUS = {
    upcoming: {
      label: "Sắp diễn ra",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: Clock,
    },
    active: {
      label: "Đang sử dụng",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle,
    },
    completed: {
      label: "Hoàn thành",
      color: "text-slate-600",
      bg: "bg-slate-100",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Hủy",
      color: "text-rose-600",
      bg: "bg-rose-50",
      icon: XCircle,
    },
    expired: {
      label: "Hết hạn",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: AlertCircle,
    },
  };

  const config = STATUS[status] || STATUS.upcoming;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded border ${config.bg} ${config.color}`}
    >
      <Icon className="w-3 h-3" /> {config.label}
    </span>
  );
};

const DashboardStaff = () => {
  const user = getUserFromToken();
  const stationId = user?.station_id;

  const [sessions, setSessions] = useState([]);
  const [points, setPoints] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  // =============================== FETCH DATA ===============================
  const loadData = async () => {
    setLoading(true);
    try {
      const s = await chargingSessionService.getSessionsByStation(stationId);
      const p = await pointService.getPointsByStationId(stationId);
      const b = await bookingService.getBookingsByStationId(stationId);

      setSessions(s?.data || s || []);
      setPoints(p?.points || []);
      setBookings(b?.bookings || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (stationId) loadData();
  }, [stationId]);

  // =============================== STATS ===============================

  const todayStr = new Date().toISOString().split("T")[0];

  // Session
  const sessionsToday = sessions.filter((s) =>
    String(s.start_time).startsWith(todayStr)
  );
  const inProgress = sessions.filter((s) => s.status === "IN_PROGRESS");
  const revenueToday = sessions
    .filter((s) => s.payment_status === "paid")
    .filter((s) => String(s.end_time).startsWith(todayStr))
    .reduce((a, b) => a + (b.total_price || 0), 0);

  const pointEmpty = points.filter((p) => p.point_status === "Empty").length;
  const pointCharging = points.filter((p) => p.point_status === "Charging")
    .length;
  const pointMaintenance = points.filter(
    (p) => p.point_status === "Maintenance"
  ).length;

  // Booking
  const bookingsToday = bookings.filter((b) =>
    String(b.schedule_start_time).startsWith(todayStr)
  );
  const bookingsUpcoming = bookings.filter((b) => b.status === "upcoming");
  const bookingsActive = bookings.filter((b) => b.status === "active");

  // =============================== RENDER ===============================
  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="p-6 space-y-8">

      {/* ============================ SESSION CARDS ============================ */}
      <h2 className="text-xl font-semibold">Thống kê phiên sạc</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Phiên hôm nay" value={sessionsToday.length} icon={Clock} />
        <StatCard label="Đang sạc" value={inProgress.length} icon={Zap} />
        <StatCard
          label="Doanh thu hôm nay"
          value={formatCurrency(revenueToday)}
          icon={Banknote}
        />
        <StatCard label="Điểm trống" value={pointEmpty} icon={Battery} />
        <StatCard label="Đang sạc" value={pointCharging} icon={Dot} />
        <StatCard label="Bảo trì" value={pointMaintenance} icon={AlertCircle} />
      </div>

      {/* ============================ BOOKING CARDS ============================ */}
      <h2 className="text-xl font-semibold">Thống kê đặt chỗ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Booking hôm nay" value={bookingsToday.length} icon={Calendar} />
        <StatCard label="Sắp diễn ra" value={bookingsUpcoming.length} icon={Clock} />
        <StatCard label="Đang sử dụng" value={bookingsActive.length} icon={CheckCircle} />
      </div>

      {/* ============================ BOOKINGS TABLE ============================ */}
      <div className="bg-white shadow-sm border rounded-xl">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Booking hôm nay</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <Th>Mã</Th>
              <Th>Xe</Th>
              <Th>Khách</Th>
              <Th>Thời gian</Th>
              <Th>Trạng thái</Th>
            </tr>
          </thead>

          <tbody>
            {bookingsToday.map((b) => (
              <tr key={b.id} className="border-b">
                <Td className="font-mono font-semibold text-violet-600">
                  {b.booking_code}
                </Td>

                <Td>{b.vehicle_name}</Td>
                <Td>{b.user_id}</Td>

                <Td>
                  <div className="text-xs">
                    {new Date(b.schedule_start_time).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Td>

                <Td>
                  <BookingBadge status={b.status} />
                </Td>
              </tr>
            ))}

            {bookingsToday.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  Không có booking nào hôm nay
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// =============================== COMPONENTS ===============================

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
    <Icon className="w-9 h-9 text-slate-500" />
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
    {children}
  </th>
);

const Td = ({ children, className }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

export default DashboardStaff;
