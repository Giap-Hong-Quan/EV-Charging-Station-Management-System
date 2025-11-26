
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  DollarSign,
  Activity,
  Clock,
  Battery,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DashboardAdmin = () => {
  // Sample data
  const stats = {
    totalStations: 24,
    activeStations: 21,
    totalChargers: 96,
    availableChargers: 58,
    totalRevenue: 245600000,
    todayRevenue: 8450000,
    totalSessions: 1847,
    activeSessions: 12,
    totalUsers: 3421,
    activeUsers: 156,
  };

  const revenueData = [
    { month: "T1", value: 18500000 },
    { month: "T2", value: 21200000 },
    { month: "T3", value: 24800000 },
    { month: "T4", value: 22100000 },
    { month: "T5", value: 26900000 },
    { month: "T6", value: 24560000 },
  ];

  const topStations = [
    {
      id: 1,
      name: "Trạm Vincom Đồng Khởi",
      sessions: 342,
      revenue: 42500000,
      utilization: 87,
    },
    {
      id: 2,
      name: "Trạm Landmark 81",
      sessions: 298,
      revenue: 38900000,
      utilization: 82,
    },
    {
      id: 3,
      name: "Trạm Bitexco",
      sessions: 276,
      revenue: 35200000,
      utilization: 78,
    },
    {
      id: 4,
      name: "Trạm Crescent Mall",
      sessions: 251,
      revenue: 31800000,
      utilization: 71,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "success",
      message: "Phiên sạc hoàn tất tại Trạm Vincom Đồng Khởi",
      time: "2 phút trước",
    },
    {
      id: 2,
      type: "warning",
      message: "Trạm Landmark 81 - Cổng 3 cần bảo trì",
      time: "15 phút trước",
    },
    {
      id: 3,
      type: "info",
      message: "Người dùng mới đăng ký: Nguyễn Văn A",
      time: "32 phút trước",
    },
    {
      id: 4,
      type: "error",
      message: "Trạm Bitexco - Cổng 2 mất kết nối",
      time: "1 giờ trước",
    },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Tổng quan hệ thống trạm sạc xe điện
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Cập nhật lần cuối</p>
            <p className="font-semibold text-slate-900">
              {new Date().toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tổng trạm */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-violet-600" />
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                +12%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Tổng số trạm</p>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalStations}
            </p>
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {stats.activeStations} đang hoạt động
            </p>
          </div>

          {/* Điểm sạc */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                60% khả dụng
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Điểm sạc</p>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalChargers}
            </p>
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {stats.availableChargers} sẵn sàng
            </p>
          </div>

          {/* Doanh thu */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Doanh thu tháng này</p>
            <p className="text-3xl font-bold text-slate-900">
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Hôm nay: {(stats.todayRevenue / 1000000).toFixed(2)}M đ
            </p>
          </div>

          {/* Người dùng */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                +24%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Người dùng</p>
            <p className="text-3xl font-bold text-slate-900">
              {stats.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {stats.activeUsers} đang sử dụng
            </p>
          </div>
        </div>

        {/* Row 2: Revenue Chart + Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Biểu đồ doanh thu */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Doanh thu 6 tháng
                </h3>
                <p className="text-sm text-slate-500">
                  Theo dõi xu hướng doanh thu
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Tổng:</span>
                <span className="text-lg font-bold text-emerald-600">
                  {(
                    revenueData.reduce((sum, d) => sum + d.value, 0) / 1000000
                  ).toFixed(1)}
                  M đ
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 h-48">
              {revenueData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-slate-100 rounded-t-lg relative group">
                    <div
                      className="bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg transition-all duration-300 hover:from-violet-700 hover:to-violet-500 cursor-pointer"
                      style={{
                        height: `${(item.value / maxRevenue) * 180}px`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {(item.value / 1000000).toFixed(1)}M đ
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-2">
                    {item.month}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Phiên sạc */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Phiên sạc
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg border border-violet-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tổng phiên</span>
                  <Battery className="w-5 h-5 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalSessions.toLocaleString()}
                </p>
                <p className="text-xs text-violet-600 mt-1">
                  Trung bình 247/ngày
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Đang sạc</span>
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.activeSessions}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Thời gian TB: 45 phút
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Tỷ lệ sử dụng</span>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">73%</p>
                <p className="text-xs text-blue-600 mt-1">
                  +5% so với tuần trước
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Top Stations + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top trạm */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Top trạm hiệu suất cao
              </h3>
              <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {topStations.map((station, idx) => (
                <div
                  key={station.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-violet-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {station.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {station.sessions} phiên sạc
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        {(station.revenue / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-slate-500">doanh thu</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                        style={{ width: `${station.utilization}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">
                      {station.utilization}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hoạt động gần đây */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Hoạt động gần đây
              </h3>
              <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                Xem tất cả
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const iconMap = {
                  success: {
                    Icon: CheckCircle,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  warning: {
                    Icon: AlertCircle,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                  info: {
                    Icon: Activity,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  error: {
                    Icon: XCircle,
                    color: "text-rose-600",
                    bg: "bg-rose-50",
                  },
                };

                const { Icon, color, bg } = iconMap[activity.type];

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;