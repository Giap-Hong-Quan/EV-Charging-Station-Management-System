// src/components/session/SessionDetailModal.jsx
import React from "react";
import {
  X,
  CheckCircle,
  Zap,
  AlertCircle,
  CreditCard,
  MapPin,
  BatteryCharging,
  Clock
} from "lucide-react";

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDuration = (minutes) => {
  if (!minutes) return "0 phút";
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} phút`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SessionDetailModal = ({ session, onClose }) => {
  if (!session) return null;

  const isCompleted = (session.status || "").toUpperCase() === "COMPLETED";
  const isInProgress = (session.status || "").toUpperCase() === "IN_PROGRESS";

  const startSoc = session.start_soc_percent || 0;
  const endSoc = session.end_soc_percent || startSoc;
  const socDiff = Math.max(0, endSoc - startSoc);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Chi tiết phiên sạc
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono border">
                #{session.session_code}
              </span>
              <span className="text-sm text-slate-400">•</span>
              <span className="text-sm text-slate-500">
                {formatDateTime(session.start_time)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Banner */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${
            isCompleted
              ? "bg-emerald-50 border-emerald-100"
              : isInProgress
              ? "bg-blue-50 border-blue-100"
              : "bg-gray-50 border-gray-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : isInProgress ? (
                  <Zap className="w-6 h-6 text-blue-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg">
                  {isCompleted
                    ? "Đã hoàn thành"
                    : isInProgress
                    ? "Đang sạc"
                    : session.status}
                </p>
                <p className="text-xs text-slate-500">Trạng thái hiện tại</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">
                {formatCurrency(session.total_price)}
              </p>
              <p className="text-xs text-slate-500">Tổng chi phí</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Thông tin xe */}
            <div className="bg-slate-50 p-5 rounded-2xl border">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-violet-600" /> Thông tin xe
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tên xe</span>
                  <span className="font-medium">{session.vehicle_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biển số</span>
                  <span className="font-mono font-bold">{session.vehicle_number}</span>
                </div>
              </div>
            </div>

            {/* Thông tin trạm */}
            <div className="bg-slate-50 p-5 rounded-2xl border">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-rose-500" /> Vị trí sạc
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Trạm sạc</p>
                  <p className="font-medium">{session.station_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Trụ sạc</p>
                  <p className="font-medium">{session.point_name}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Pin & năng lượng */}
          <div className="bg-slate-50 p-5 rounded-2xl border">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <BatteryCharging className="w-4 h-4 text-emerald-600" /> Pin & Năng lượng
            </h3>

            <div className="text-sm">
              <div className="flex justify-between mb-2 font-medium">
                <span>{startSoc}%</span>
                <span className="text-emerald-600 font-bold">
                  +{session.total_kwh?.toFixed(2) || 0} kWh
                </span>
                <span>{session.end_soc_percent}%</span>
              </div>

              <div className="w-full bg-slate-200 h-4 rounded-full relative overflow-hidden">
                <div
                  className="absolute h-full bg-emerald-500"
                  style={{
                    left: `${startSoc}%`,
                    width: `${socDiff}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div className="bg-slate-50 p-5 rounded-2xl border">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-600" /> Thời gian
            </h3>
            <div className="text-sm space-y-3">
              <div className="flex justify-between">
                <span>Bắt đầu:</span>
                <span className="font-mono">{formatDateTime(session.start_time)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kết thúc:</span>
                <span className="font-mono">{formatDateTime(session.end_time)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Tổng thời gian:</span>
                <span className="font-bold text-blue-700">
                  {formatDuration(session.duration_time)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SessionDetailModal;
