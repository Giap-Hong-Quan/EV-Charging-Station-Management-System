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
  HelpCircle,
  Download,
  Eye,
  Ban,
  PlayCircle,
  StopCircle,
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
    UPCOMING: {
      label: "Sắp diễn ra",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock,
    },
    HELP: {
      label: "Cần hỗ trợ",
      className: "bg-orange-50 text-orange-700 border-orange-200",
      icon: HelpCircle,
    },
    CONFIRMED: {
      label: "Đã xác nhận",
      className: "bg-violet-50 text-violet-700 border-violet-200",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "Đã hủy",
      className: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    },
    COMPLETED: {
      label: "Hoàn thành",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    FAILED: {
      label: "Thất bại",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
    EXPIRED: {
      label: "Hết hạn",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.UPCOMING;
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

// =====================================================================
// 🎨 Detail Modal Component
// =====================================================================
const BookingDetailModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Chi tiết đặt chỗ</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <QRCodeCanvas
              value={booking.booking_code}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
            <p className="text-sm font-mono text-slate-600 mt-2">{booking.booking_code}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <StatusBadge status={booking.status} />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Trạm sạc</p>
            <p className="text-sm font-semibold text-slate-900">{booking.station_id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Điểm sạc</p>
            <p className="text-sm font-semibold text-slate-900">{booking.point_id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Tên xe</p>
            <p className="text-sm font-semibold text-slate-900">{booking.vehicle_name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Biển số</p>
            <p className="text-sm font-mono font-semibold text-slate-900">{booking.vehicle_number}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Khách hàng</p>
            <p className="text-sm font-mono text-slate-900">{booking.user_id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Thời gian bắt đầu</p>
            <p className="text-sm text-slate-900">{formatDateTime(booking.schedule_start_time)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Thời gian kết thúc</p>
            <p className="text-sm text-slate-900">{formatDateTime(booking.schedule_end_time)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium">Ngày tạo</p>
            <p className="text-sm text-slate-900">{formatDateTime(booking.createdAt)}</p>
          </div>

          {booking.cancelled_at && (
            <div className="col-span-2 space-y-1">
              <p className="text-xs text-slate-500 font-medium">Ngày hủy</p>
              <p className="text-sm text-rose-600">{formatDateTime(booking.cancelled_at)}</p>
            </div>
          )}

          {booking.hold_expires_at && (
            <div className="col-span-2 space-y-1">
              <p className="text-xs text-slate-500 font-medium">Hết hạn giữ chỗ</p>
              <p className="text-sm text-amber-600">{formatDateTime(booking.hold_expires_at)}</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
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

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  // =====================================================================
  // 🔥 Fetch bookings
  // =====================================================================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getAllBookings();
      console.log("=== API BOOKINGS ===", res);
      
      const bookingsData = res.data || res;
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
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
        removeVietnameseTones(b.station_id),
        removeVietnameseTones(b.point_id),
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all" ? true : b.status === filterStatus;

      return matchText && matchFilter;
    });

    setFilteredBookings(temp);
  }, [searchTerm, filterStatus, bookings]);

  // =====================================================================
  // 🔄 Update booking status
  // =====================================================================
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus({
        booking_id: bookingId,
        status: newStatus,
      });
      toast.success(`Đã cập nhật trạng thái thành công`);
      fetchBookings();
    } catch (err) {
      console.error("Lỗi update status:", err);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // =====================================================================
  // 🗑 Cancel booking
  // =====================================================================
  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn hủy booking này?")) return;
    
    try {
      await bookingService.cancelBooking({ booking_id: id });
      toast.success("Đã hủy booking thành công");
      fetchBookings();
    } catch (err) {
      console.error("Lỗi hủy booking:", err);
      toast.error("Không thể hủy booking");
    }
  };

  // =====================================================================
  // 📥 Export to CSV
  // =====================================================================
  const handleExport = () => {
    const csv = [
      ["Mã booking", "Xe", "Biển số", "Trạm", "Điểm", "Khách hàng", "Bắt đầu", "Kết thúc", "Trạng thái"],
      ...filteredBookings.map(b => [
        b.booking_code,
        b.vehicle_name,
        b.vehicle_number,
        b.station_id,
        b.point_id,
        b.user_id,
        b.schedule_start_time,
        b.schedule_end_time,
        b.status,
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Đã xuất file CSV");
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  // =====================================================================
  // 📌 TÍNH TOÁN THỐNG KÊ
  // =====================================================================
  const total = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === "UPCOMING").length;
  const helpCount = bookings.filter((b) => b.status === "HELP").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const failedCount = bookings.filter((b) => b.status === "FAILED").length;
  const expiredCount = bookings.filter((b) => b.status === "EXPIRED").length;

  // =====================================================================
  // 🎨 Format functions
  // =====================================================================
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // =====================================================================
  // RENDER UI
  // =====================================================================
  return (
    <div>
      {/* ============================
          📊 STATS - 7 trạng thái
      ============================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-4">
        {/* Tổng */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <p className="text-xs text-slate-600 font-medium">Tổng</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{total}</p>
        </div>

        {/* Sắp diễn ra */}
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-700" />
            <p className="text-xs text-blue-700 font-medium">Sắp tới</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{upcomingCount}</p>
        </div>

        {/* Đã xác nhận */}
        <div className="bg-violet-50 p-3 rounded-xl border border-violet-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-violet-700" />
            <p className="text-xs text-violet-700 font-medium">Xác nhận</p>
          </div>
          <p className="text-2xl font-bold text-violet-700">{confirmedCount}</p>
        </div>

        {/* Hoàn thành */}
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <p className="text-xs text-emerald-700 font-medium">Hoàn thành</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{completedCount}</p>
        </div>

        {/* Cần hỗ trợ */}
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-orange-700" />
            <p className="text-xs text-orange-700 font-medium">Hỗ trợ</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{helpCount}</p>
        </div>

        {/* Đã hủy */}
        <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-rose-700" />
            <p className="text-xs text-rose-700 font-medium">Đã hủy</p>
          </div>
          <p className="text-2xl font-bold text-rose-700">{cancelledCount}</p>
        </div>

        {/* Thất bại + Hết hạn */}
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <p className="text-xs text-amber-700 font-medium">Lỗi/Hết hạn</p>
          </div>
          <p className="text-2xl font-bold text-amber-700">{failedCount + expiredCount}</p>
        </div>
      </div>

      {/* ============================
          🎨 CARD CHỨA SEARCH + TABLE
      ============================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
        
        {/* 🔍 SEARCH + FILTER + ACTIONS */}
        <div className="flex items-center gap-3 mb-4">
          
          {/* Ô tìm kiếm */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm booking..."
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
                {["all", "UPCOMING", "CONFIRMED", "COMPLETED", "HELP", "CANCELLED", "FAILED", "EXPIRED"].map((status) => (
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
                    {status === "all" ? "Tất cả" : status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BUTTON Export */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-100"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>

          {/* BUTTON Refresh */}
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-100"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">QR Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Xe</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạm/Điểm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => {
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    {/* QR CODE */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center">
                        <QRCodeCanvas
                          value={b.booking_code}
                          size={60}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                    </td>

                    {/* XE */}
                    <td className="px-4 py-3">
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

                    {/* TRẠM/ĐIỂM */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <MapPin className="w-3 h-3" />
                          <span className="font-mono">{b.station_id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-violet-600" />
                          <span className="text-xs font-semibold text-violet-600">{b.point_id}</span>
                        </div>
                      </div>
                    </td>

                    {/* KHÁCH HÀNG */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-xs">{b.user_id}</span>
                      </div>
                    </td>

                    {/* THỜI GIAN */}
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3 h-3 text-emerald-500" />
                          <span>{formatTime(b.schedule_start_time)}</span>
                          <span className="text-slate-400">→</span>
                          <span>{formatTime(b.schedule_end_time)}</span>
                        </div>
                        <div className="text-slate-500">
                          {formatDate(b.schedule_start_time)}
                        </div>
                      </div>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* THAO TÁC */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {b.status === "UPCOMING" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                              className="p-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors"
                              title="Xác nhận"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(b.id)}
                              className="p-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                              title="Hủy"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {b.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                            className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Hoàn thành"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE */}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500">
                    Không tìm thấy booking phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="mt-4 text-sm text-slate-600">
          Hiển thị <strong>{filteredBookings.length}</strong> / <strong>{total}</strong> booking
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingAdmin;