import React, { useState } from "react";
import {
  Package,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Plus,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  TrendingUp,
  Sparkles,
  Crown,
} from "lucide-react";

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
// 🎨 Mock Data
// =====================================================================
const mockPackages = [
  {
    id: 1,
    name: "Gói Cơ Bản",
    description: "Phù hợp cho người dùng thường xuyên",
    duration_minutes: 60,
    price: 50000,
    is_active: true,
    features: ["Sạc nhanh", "Hỗ trợ 24/7"],
    created_at: "2024-01-15T10:30:00Z",
    popularity: "normal",
    color: "blue",
  },
  {
    id: 2,
    name: "Gói Tiêu Chuẩn",
    description: "Lựa chọn phổ biến nhất",
    duration_minutes: 120,
    price: 90000,
    is_active: true,
    features: ["Sạc nhanh", "Hỗ trợ 24/7", "Ưu tiên đặt chỗ"],
    created_at: "2024-01-16T11:00:00Z",
    popularity: "popular",
    color: "emerald",
  },
  {
    id: 3,
    name: "Gói Cao Cấp",
    description: "Trải nghiệm VIP cho khách hàng",
    duration_minutes: 240,
    price: 150000,
    is_active: true,
    features: ["Sạc siêu nhanh", "Hỗ trợ 24/7", "Ưu tiên đặt chỗ", "Bảo dưỡng miễn phí"],
    created_at: "2024-01-17T09:15:00Z",
    popularity: "premium",
    color: "amber",
  },
  {
    id: 4,
    name: "Gói Dùng Thử",
    description: "Gói dành cho người dùng mới",
    duration_minutes: 30,
    price: 25000,
    is_active: false,
    features: ["Sạc thường"],
    created_at: "2024-01-10T08:00:00Z",
    popularity: "normal",
    color: "slate",
  },
];

const ServiceAdmin = () => {
  const [packages, setPackages] = useState(mockPackages);
  const [filteredPackages, setFilteredPackages] = useState(mockPackages);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState("cards"); // cards or table

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // =====================================================================
  // 🔍 SEARCH + FILTER LOGIC
  // =====================================================================
  React.useEffect(() => {
    let temp = [...packages];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((pkg) => {
      const fields = [
        removeVietnameseTones(pkg.name),
        removeVietnameseTones(pkg.description),
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
          ? pkg.is_active
          : !pkg.is_active;

      return matchText && matchFilter;
    });

    setFilteredPackages(temp);
  }, [searchTerm, filterStatus, packages]);

  // =====================================================================
  // 🗑 Delete package
  // =====================================================================
  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      alert("Đã xóa gói dịch vụ thành công");
    }
  };

  // =====================================================================
  // 📌 TÍNH TOÁN THỐNG KÊ
  // =====================================================================
  const total = packages.length;
  const activeCount = packages.filter((pkg) => pkg.is_active).length;
  const inactiveCount = total - activeCount;
  const avgPrice = packages.reduce((sum, pkg) => sum + pkg.price, 0) / total;

  // =====================================================================
  // 🎨 Format functions
  // =====================================================================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // =====================================================================
  // 🎨 Get color classes
  // =====================================================================
  const getColorClasses = (color, popularity) => {
    const colors = {
      blue: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        border: "border-blue-300",
        badge: "bg-blue-100 text-blue-700 border-blue-300",
      },
      emerald: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        border: "border-emerald-300",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-500 to-amber-600",
        border: "border-amber-300",
        badge: "bg-amber-100 text-amber-700 border-amber-300",
      },
      slate: {
        bg: "bg-gradient-to-br from-slate-400 to-slate-500",
        border: "border-slate-300",
        badge: "bg-slate-100 text-slate-700 border-slate-300",
      },
    };
    return colors[color] || colors.blue;
  };

  // =====================================================================
  // RENDER UI - CARDS VIEW
  // =====================================================================
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {filteredPackages.map((pkg) => {
        const colorClasses = getColorClasses(pkg.color, pkg.popularity);
        
        return (
          <div
            key={pkg.id}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-violet-300"
          >
            {/* Header với gradient */}
            <div className={`${colorClasses.bg} p-6 text-white relative overflow-hidden`}>
              {/* Popularity badge */}
              {pkg.popularity === "popular" && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-white/30">
                    <Star className="w-3 h-3 fill-white" />
                    <span className="text-xs font-bold">PHỔ BIẾN</span>
                  </div>
                </div>
              )}
              {pkg.popularity === "premium" && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 border border-white/30">
                    <Crown className="w-3 h-3 fill-white" />
                    <span className="text-xs font-bold">VIP</span>
                  </div>
                </div>
              )}

              {/* Package icon */}
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/30">
                <Package className="w-7 h-7" />
              </div>

              {/* Name & Description */}
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-white/90 text-sm">{pkg.description}</p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Price & Duration */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{formatPrice(pkg.price)}</p>
                  <div className="flex items-center gap-2 mt-1 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDuration(pkg.duration_minutes)}</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  {pkg.is_active ? (
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Active</span>
                    </div>
                  ) : (
                    <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Inactive</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tính năng</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${colorClasses.badge} flex items-center gap-1`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setOpenEdit(true);
                  }}
                  className="flex-1 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg font-medium hover:bg-violet-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg font-medium hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full -mr-16 -mt-16"></div>
          </div>
        );
      })}
    </div>
  );

  // =====================================================================
  // RENDER UI - MAIN
  // =====================================================================
  return (
    <div>
      {/* ============================
          🔍 SEARCH + FILTER BAR
      ============================= */}
      <div className="bg-white/60 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 p-4 mt-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm gói dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filter Dropdown */}
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-20">
                {["all", "active", "inactive"].map((status) => (
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
                      : status === "active"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm
          </button>
        </div>
      </div>

      {/* ============================
          📦 PACKAGES VIEW
      ============================= */}
      {filteredPackages.length > 0 ? (
        renderCardsView()
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center mt-6">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy gói dịch vụ</h3>
          <p className="text-slate-600">Thử thay đổi bộ lọc hoặc tạo gói mới</p>
        </div>
      )}

      {/* ============================
          🎨 MODALS
      ============================= */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Tạo gói dịch vụ mới
            </h3>
            <p className="text-slate-600 mb-6">Form thêm gói dịch vụ sẽ ở đây...</p>
            <button
              onClick={() => setOpenAdd(false)}
              className="w-full px-6 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {openEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Chỉnh sửa gói dịch vụ
            </h3>
            <p className="text-slate-600 mb-2">
              Đang chỉnh sửa: <strong className="text-slate-900">{selectedPackage?.name}</strong>
            </p>
            <p className="text-slate-500 text-sm mb-6">Form chỉnh sửa sẽ ở đây...</p>
            <button
              onClick={() => setOpenEdit(false)}
              className="w-full px-6 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAdmin;