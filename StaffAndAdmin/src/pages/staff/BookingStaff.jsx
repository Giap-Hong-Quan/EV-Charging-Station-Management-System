import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Car,
  User,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Zap,
} from "lucide-react";

import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";

// =====================================================================
// Helper: Bỏ dấu tiếng Việt + lowercase
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
// Badge trạng thái booking
// =====================================================================
const StatusBadge = ({ status }) => {
  const STATUS = {
    upcoming: {
      label: "Sắp diễn ra",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock,
    },
    active: {
      label: "Đang sử dụng",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-slate-100 text-slate-600 border-slate-200",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
    expired: {
      label: "Hết hạn",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    },
  };

  const config = STATUS[status] || STATUS.upcoming;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const BookingStaff = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Lấy station_id của staff
const token = localStorage.getItem("token");
let user = null;
if (token) {
  user = JSON.parse(atob(token.split(".")[1]));
}
  // =====================================================================
  // Fetch bookings
  // =====================================================================
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await bookingService.getBookingsByStationId(user.station_id);
      console.log("API BOOKINGS:", res);

      // Normalize data
      const normalized = (res.bookings || []).map((b) => ({
        ...b,
        status: b.status?.toLowerCase(),
      }));

      setBookings(normalized);
      setFilteredBookings(normalized);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      toast.error("Không thể tải danh sách đặt chỗ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =====================================================================
  // Search + Filter
  // =====================================================================
  useEffect(() => {
    let temp = [...bookings];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((b) => {
      const values = [
        removeVietnameseTones(b.booking_code),
        removeVietnameseTones(b.vehicle_name),
        removeVietnameseTones(b.vehicle_number),
        removeVietnameseTones(b.user_id),
      ];

      const matchText = values.some((v) => v.includes(keyword));
      const matchFilter =
        filterStatus === "all" ? true : b.status === filterStatus;

      return matchText && matchFilter;
    });

    setFilteredBookings(temp);
  }, [searchTerm, filterStatus, bookings]);

  // =====================================================================
  // Update status (Start / Complete)
  // =====================================================================
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus({
        booking_id: bookingId,
        status,
      });

      toast.success("Đã cập nhật trạng thái!");
      fetchBookings();
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái",err);
    }
  };

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  // =====================================================================
  // Stats
  // =====================================================================
  const total = bookings.length;
  const upcoming = bookings.filter((b) => b.status === "upcoming").length;
  const active = bookings.filter((b) => b.status === "active").length;
  const todayCount = bookings.filter((b) => {
    const d1 = new Date(b.schedule_start_time).toDateString();
    const d2 = new Date().toDateString();
    return d1 === d2;
  }).length;

  // =====================================================================
  // Render
  // =====================================================================
  return (
    <div>
      {/* ================================ */}
      {/* STATS */}
      {/* ================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatBox label="Hôm nay" value={todayCount} icon={Calendar} color="emerald" />
        <StatBox label="Sắp diễn ra" value={upcoming} icon={Clock} color="blue" />
        <StatBox label="Đang sử dụng" value={active} icon={Zap} color="violet" />
        <StatBox label="Tổng đặt chỗ" value={total} icon={MapPin} color="slate" />
      </div>

      {/* ================================ */}
      {/* SEARCH + FILTER + REFRESH */}
      {/* ================================ */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mt-6">
        <div className="flex items-center gap-3 mb-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm booking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-50 border rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Lọc
              <ChevronDown
                className={`w-4 h-4 transition ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl p-2 z-20">
                {["all", "upcoming", "active", "completed", "cancelled", "expired"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        filterStatus === status
                          ? "bg-violet-50 text-violet-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {status === "all"
                        ? "Tất cả"
                        : status === "upcoming"
                        ? "Sắp diễn ra"
                        : status === "active"
                        ? "Đang sử dụng"
                        : status === "completed"
                        ? "Hoàn thành"
                        : status === "cancelled"
                        ? "Đã hủy"
                        : "Hết hạn"}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>

        {/* ================================ */}
        {/* TABLE */}
        {/* ================================ */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <Th>Mã</Th>
                <Th>Xe</Th>
                <Th>Khách hàng</Th>
                <Th>Thời gian</Th>
                <Th>Trạng thái</Th>
                <Th>Thao tác</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <Td>
                    <span className="font-mono font-semibold text-violet-600">
                      {b.booking_code}
                    </span>
                  </Td>

                  <Td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-500" />
                        {b.vehicle_name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {b.vehicle_number}
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-mono text-xs">{b.user_id}</span>
                    </div>
                  </Td>

                  <Td>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {new Date(b.schedule_start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        <span className="text-slate-400">→</span>
                        {new Date(b.schedule_end_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-slate-500">
                        {new Date(b.schedule_start_time).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <StatusBadge status={b.status} />
                  </Td>

                  <Td>
                    <div className="flex gap-2">
                      {b.status === "upcoming" && (
                        <ActionButton
                          onClick={() => handleUpdateStatus(b.id, "active")}
                          text="Bắt đầu"
                          color="emerald"
                        />
                      )}

                      {b.status === "active" && (
                        <ActionButton
                          onClick={() => handleUpdateStatus(b.id, "completed")}
                          text="Hoàn thành"
                          color="blue"
                        />
                      )}
                    </div>
                  </Td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500">
                    Không tìm thấy booking phù hợp
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

// =====================================================================
// COMPONENTS PHỤ (StatBox, Th, Td, ActionButton)
// =====================================================================

const StatBox = ({ label, value, icon: Icon, color }) => {
  const bg = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
  }[color];

  return (
    <div className={`p-4 rounded-xl border shadow-sm flex justify-between items-center ${bg}`}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className="w-11 h-11 bg-white/40 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-6 py-4 text-sm text-slate-700">{children}</td>
);

const ActionButton = ({ onClick, text, color }) => {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-lg border transition ${styles}`}
    >
      {text}
    </button>
  );
};

export default BookingStaff;
