import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  User,
} from "lucide-react";

import { bookingService } from "@/services/bookingService";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

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
// 🎨 Status Badge Component
// =====================================================================
const StatusBadge = ({ status }) => {
  const statusConfig = {
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

  const config = statusConfig[status] || statusConfig.upcoming;
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

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // =====================================================================
  // 🔥 Fetch bookings
  // =====================================================================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings();
         console.log("=== API BOOKINGS ===", res);
    setBookings(res.data || []);
        setFilteredBookings(res.data || []);

    } catch (err) {
      console.error("Lỗi fetch booking:", err);
      toast.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =====================================================================
  // 🔍 SEARCH + FILTER LOGIC
  // =====================================================================
  useEffect(() => {
    let temp = [...bookings];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((b) => {
      const fields = [
        removeVietnameseTones(b.booking_code),
        removeVietnameseTones(b.vehicle_name),
        removeVietnameseTones(b.vehicle_number),
        removeVietnameseTones(b.user_id),
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all" ? true : b.status === filterStatus;

      return matchText && matchFilter;
    });

    setFilteredBookings(temp);
  }, [searchTerm, filterStatus, bookings]);

  // =====================================================================
  // 🗑 Delete booking (Cancel)
  // =====================================================================
  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking({ booking_id: id });
      toast.success("Đã hủy booking thành công");
      fetchBookings();
    } catch (err) {
      toast.error("Không thể hủy booking",err);
    }
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  // =====================================================================
  // 📌 TÍNH TOÁN THỐNG KÊ
  // =====================================================================
  const total = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const activeCount = bookings.filter((b) => b.status === "active").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  // =====================================================================
  // RENDER UI
  // =====================================================================
  return (
    <div>
      {/* ============================
          📊 STATS
      ============================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Tổng số booking */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-slate-600 font-medium">Tổng booking</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Sắp diễn ra */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-blue-700 font-medium">Sắp diễn ra</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{upcomingCount}</p>
          </div>
          <div className="w-11 h-11 bg-blue-200 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        {/* Đang sử dụng */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-emerald-700 font-medium">Đang sử dụng</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-11 h-11 bg-emerald-200 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* Đã hủy */}
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-rose-700 font-medium">Đã hủy</p>
            <p className="text-3xl font-bold text-rose-700 mt-1">{cancelledCount}</p>
          </div>
          <div className="w-11 h-11 bg-rose-200 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6 text-rose-700" />
          </div>
        </div>
      </div>

      {/* ============================
          🎨 CARD CHỨA SEARCH + TABLE
      ============================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
        
        {/* 🔍 SEARCH + FILTER */}
        <div className="flex items-center gap-3 mb-4">
          
          {/* Ô tìm kiếm */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm booking (mã, xe, biển số)..."
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

            {/* DROPDOWN FILTER */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-20">
                {["all", "upcoming", "active", "completed", "cancelled", "expired"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      filterStatus === status
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-700 hover:bg-slate-50"
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
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mã booking</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thông tin xe</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Người đặt</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => {
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    {/* MÃ BOOKING */}
                  <td className="px-6 py-4">
                    <QRCodeCanvas
                        value={b.booking_code}          // nội dung QR
                        size={70}                       // kích thước QR
                        bgColor="#ffffff"               // nền trắng
                        fgColor="#000000"               // màu mã
                        level="H"                       // chất lượng cao
                    />
                    
                    {/* Hiển thị mã bên dưới nếu muốn */}
                    <div className="text-xs text-slate-500 mt-1">
                        {b.booking_code}
                    </div>
                    </td>


                    {/* THÔNG TIN XE */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <Car className="w-4 h-4 text-slate-500" />
                          {b.vehicle_name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {b.vehicle_number}
                        </div>
                      </div>
                    </td>

                    {/* NGƯỜI ĐẶT */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-xs">{b.user_id}</span>
                      </div>
                    </td>

                    {/* THỜI GIAN */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Bắt đầu: {new Date(b.schedule_start_time).toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Kết thúc: {new Date(b.schedule_end_time).toLocaleString("vi-VN")}</span>
                        </div>
                      </div>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* THAO TÁC */}
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {b.status === "upcoming" && (
                          <XCircle
                            className="w-5 h-5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            onClick={() => handleCancel(b.id)}
                            title="Hủy booking"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE */}
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

export default BookingAdmin;