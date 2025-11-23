import React, { useState } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

const AnalyticsAdmin = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // AI Predictions & Insights Data
  const demandForecast = [
    { hour: "00:00", actual: 12, predicted: 15, confidence: 85 },
    { hour: "03:00", actual: 8, predicted: 10, confidence: 88 },
    { hour: "06:00", actual: 45, predicted: 48, confidence: 92 },
    { hour: "09:00", actual: 78, predicted: 75, confidence: 89 },
    { hour: "12:00", actual: 92, predicted: 95, confidence: 94 },
    { hour: "15:00", actual: 68, predicted: 70, confidence: 91 },
    { hour: "18:00", actual: 85, predicted: 88, confidence: 93 },
    { hour: "21:00", actual: 56, predicted: 58, confidence: 87 },
  ];

  const peakHours = [
    { time: "07:00 - 09:00", usage: 92, type: "morning", revenue: 8500000 },
    { time: "12:00 - 14:00", usage: 87, type: "noon", revenue: 7800000 },
    { time: "17:00 - 20:00", usage: 95, type: "evening", revenue: 9200000 },
  ];

  const stationRecommendations = [
    {
      id: 1,
      station: "Trạm Vincom Đồng Khởi",
      issue: "Quá tải vào giờ cao điểm",
      recommendation: "Nâng cấp thêm 2 điểm sạc nhanh DC",
      impact: "Tăng 25% công suất, giảm 40% thời gian chờ",
      priority: "high",
      estimatedCost: 450000000,
      roi: "8 tháng",
    },
    {
      id: 2,
      station: "Trạm Landmark 81",
      issue: "Tỷ lệ sử dụng thấp vào buổi sáng",
      recommendation: "Giảm giá 15% từ 6:00-9:00",
      impact: "Dự kiến tăng 35% lượng khách buổi sáng",
      priority: "medium",
      estimatedCost: 0,
      roi: "Ngay lập tức",
    },
    {
      id: 3,
      station: "Trạm Bitexco",
      issue: "Điểm sạc AC ít được sử dụng",
      recommendation: "Chuyển đổi 2 cổng AC sang DC CCS2",
      impact: "Tăng 45% hiệu suất sử dụng trạm",
      priority: "medium",
      estimatedCost: 280000000,
      roi: "12 tháng",
    },
    {
      id: 4,
      station: "Khu vực Quận 7",
      issue: "Không có trạm sạc trong bán kính 5km",
      recommendation: "Xây dựng trạm mới tại Crescent Mall",
      impact: "Phục vụ 500+ khách hàng tiềm năng",
      priority: "high",
      estimatedCost: 1200000000,
      roi: "18 tháng",
    },
  ];

  const userBehaviorInsights = [
    {
      pattern: "Khách hàng thường sạc 2-3 lần/tuần",
      percentage: 68,
      icon: Calendar,
      color: "blue",
    },
    {
      pattern: "Thời gian sạc TB: 35-45 phút",
      percentage: 72,
      icon: Clock,
      color: "violet",
    },
    {
      pattern: "Ưu tiên trạm gần nhà/văn phòng",
      percentage: 81,
      icon: MapPin,
      color: "emerald",
    },
    {
      pattern: "Chi tiêu TB: 450k đồng/tháng",
      percentage: 65,
      icon: TrendingUp,
      color: "amber",
    },
  ];

  const aiInsights = [
    {
      title: "Xu hướng tăng trưởng",
      description:
        "Nhu cầu sạc xe tăng 34% trong 3 tháng qua, tập trung vào khu vực trung tâm.",
      type: "success",
      confidence: 94,
    },
    {
      title: "Cảnh báo công suất",
      description:
        "3 trạm sắp đạt ngưỡng công suất tối đa vào cuối tháng này.",
      type: "warning",
      confidence: 89,
    },
    {
      title: "Cơ hội mở rộng",
      description:
        "AI phát hiện 5 khu vực tiềm năng chưa có trạm sạc trong bán kính 10km.",
      type: "info",
      confidence: 87,
    },
    {
      title: "Tối ưu giá điện",
      description:
        "Điều chỉnh giá theo giờ có thể tăng 18% doanh thu mà không giảm khách.",
      type: "success",
      confidence: 91,
    },
  ];

  const maxDemand = Math.max(...demandForecast.map((d) => Math.max(d.actual, d.predicted)));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Phân Tích AI
                </h1>
                <p className="text-slate-500 mt-1">
                  Dự đoán thông minh & gợi ý tối ưu hóa
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {["week", "month", "quarter"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {period === "week"
                  ? "Tuần"
                  : period === "month"
                  ? "Tháng"
                  : "Quý"}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiInsights.map((insight, idx) => {
            const colors = {
              success: "bg-emerald-50 border-emerald-200 text-emerald-700",
              warning: "bg-amber-50 border-amber-200 text-amber-700",
              info: "bg-blue-50 border-blue-200 text-blue-700",
            };
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${colors[insight.type]}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-semibold">
                    {insight.confidence}% tin cậy
                  </span>
                </div>
                <h3 className="font-bold mb-1">{insight.title}</h3>
                <p className="text-sm opacity-90">{insight.description}</p>
              </div>
            );
          })}
        </div>

        {/* Demand Forecast Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-violet-600" />
                Dự Báo Nhu Cầu Sạc - 24h
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                So sánh thực tế vs dự đoán AI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
                <span className="text-sm text-slate-600">Thực tế</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Dự đoán AI</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 h-64">
            {demandForecast.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex gap-1 items-end h-52">
                  {/* Actual bar */}
                  <div className="flex-1 bg-slate-100 rounded-t relative group">
                    <div
                      className="bg-violet-600 rounded-t hover:bg-violet-700 transition-colors"
                      style={{
                        height: `${(item.actual / maxDemand) * 200}px`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Thực: {item.actual}
                      </div>
                    </div>
                  </div>
                  {/* Predicted bar */}
                  <div className="flex-1 bg-slate-100 rounded-t relative group">
                    <div
                      className="bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors"
                      style={{
                        height: `${(item.predicted / maxDemand) * 200}px`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Dự đoán: {item.predicted}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-2">
                  {item.hour}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours + User Behavior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Peak Hours */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-600" />
              Giờ Cao Điểm
            </h3>
            <div className="space-y-3">
              {peakHours.map((peak, idx) => {
                const colors = {
                  morning: "from-amber-400 to-orange-500",
                  noon: "from-blue-400 to-cyan-500",
                  evening: "from-violet-500 to-purple-600",
                };
                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-900">{peak.time}</p>
                        <p className="text-sm text-slate-500">
                          Doanh thu: {(peak.revenue / 1000000).toFixed(1)}M đ
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {peak.usage}%
                        </p>
                        <p className="text-xs text-slate-500">sử dụng</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[peak.type]} rounded-full`}
                        style={{ width: `${peak.usage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Behavior */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              Hành Vi Người Dùng
            </h3>
            <div className="space-y-4">
              {userBehaviorInsights.map((behavior, idx) => {
                const Icon = behavior.icon;
                const colorMap = {
                  blue: "bg-blue-100 text-blue-600",
                  violet: "bg-violet-100 text-violet-600",
                  emerald: "bg-emerald-100 text-emerald-600",
                  amber: "bg-amber-100 text-amber-600",
                };
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        colorMap[behavior.color]
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {behavior.pattern}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                            style={{ width: `${behavior.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {behavior.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600" />
              Gợi Ý Tối Ưu Hóa Từ AI
            </h3>
            <span className="text-sm text-slate-500">
              Cập nhật: {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="space-y-3">
            {stationRecommendations.map((rec) => {
              const priorityColors = {
                high: "bg-rose-100 text-rose-700 border-rose-200",
                medium: "bg-amber-100 text-amber-700 border-amber-200",
                low: "bg-blue-100 text-blue-700 border-blue-200",
              };
              const priorityLabels = {
                high: "Ưu tiên cao",
                medium: "Ưu tiên trung bình",
                low: "Ưu tiên thấp",
              };
              return (
                <div
                  key={rec.id}
                  className="p-5 bg-slate-50 rounded-lg border border-slate-200 hover:border-violet-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-slate-900">
                          {rec.station}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                            priorityColors[rec.priority]
                          }`}
                        >
                          {priorityLabels[rec.priority]}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">Vấn đề: </span>
                            <span className="text-slate-900 font-medium">
                              {rec.issue}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">Gợi ý: </span>
                            <span className="text-slate-900 font-medium">
                              {rec.recommendation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-slate-500">Tác động: </span>
                            <span className="text-slate-900 font-medium">
                              {rec.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Chi phí: </span>
                        <span className="font-bold text-slate-900">
                          {rec.estimatedCost > 0
                            ? `${(rec.estimatedCost / 1000000).toFixed(0)}M đ`
                            : "Miễn phí"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">ROI: </span>
                        <span className="font-bold text-emerald-600">
                          {rec.roi}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm font-medium flex items-center gap-2">
                      Xem chi tiết
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                AI được huấn luyện từ 50,000+ phiên sạc
              </h3>
              <p className="text-violet-100">
                Hệ thống AI phân tích dữ liệu thời gian thực và lịch sử để đưa
                ra dự đoán chính xác 90%+, giúp tối ưu hóa vận hành và tăng
                doanh thu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAdmin;