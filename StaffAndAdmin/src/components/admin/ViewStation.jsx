import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

import { stationService } from "@/services/stationService";
import { pointService } from "@/services/pointService";

import { 
  X, MapPin, Zap, Power, Settings, Plug, Calendar 
} from "lucide-react";

import { useEffect, useState } from "react";

export default function ViewStation({ open, onOpenChange, stationId }) {
  const [station, setStation] = useState(null);
  const [points, setPoints] = useState([]);
const getPointStatusText = (status) => {
  switch (status) {
    case "Empty":
      return "Trống";
    case "Charging":
      return "Đang sạc";
    case "Maintenance":
      return "Bảo trì";
    case "Reservation":
      return "Đặt trước";
    default:
      return "Không xác định";
  }
};
const getPointStatusColor = (status) => {
  switch (status) {
    case "Empty":
      return "text-green-600";
    case "Charging":
      return "text-blue-600";
    case "Maintenance":
      return "text-amber-600";
    case "Reservation":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

  // --- FETCH STATION INFO ---
  useEffect(() => {
    const fetchStation = async () => {
      if (!stationId) return;
      try {
        const res = await stationService.getStationById(stationId);
        setStation(res.station || res);
      } catch (error) {
        console.error("Lỗi load station:", error);
      }
    };

    if (open) fetchStation();
  }, [open, stationId]);

  // --- FETCH POINTS BY STATION ID ---
  useEffect(() => {
    const fetchPoints = async () => {
      if (!stationId) return;
      try {
        const res = await pointService.getPointsByStationId(stationId);
        setPoints(res.points || res);
      } catch (error) {
        console.error("Lỗi load điểm sạc:", error);
      }
    };

    if (open) fetchPoints();
  }, [open, stationId]);

  if (!station) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>

        <DialogOverlay
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 bg-black/40 animate-fadeIn z-40"
        />

        <div
          className="
             fixed right-0 top-0 bg-white shadow-xl
            animate-slideInDrawer
            w-full sm:w-[45vw] lg:w-[35vw]
            max-w-[600px] h-screen
            flex flex-col
            z-50
          "
        >
          {/* HEADER */}
          <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-semibold">Thông tin trạm sạc</h2>
            <button onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* BODY – SCROLLABLE */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* --- STATION INFO --- */}
            <div>
              <p className="text-2xl font-semibold">{station.name}</p>

              <div className="flex items-start gap-2 mt-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{station.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mt-6">

                <InfoBox icon={<Plug className="w-4 h-4" />} label="Loại cổng" value={station.connector_type} />

                <InfoBox icon={<Zap className="w-4 h-4" />} label="Công suất" value={station.power_rating + " kW"} />

                <InfoBox icon={<Settings className="w-4 h-4" />} label="Số cổng" value={station.total_points} />

                <InfoBox icon={<Power className="w-4 h-4" />} label="Cổng trống" value={station.available_points} />

                <InfoBox
                  full
                  label="Giá mỗi kWh"
                  value={station.price_per_kwh.toLocaleString() + " đ"}
                />

                <InfoBox
                  full
                  label="Trạng thái"
                  value={station.status}
                  color={station.status === "online" ? "text-green-600" : "text-red-600"}
                />

                <InfoBox
                  full
                  label="Ngày tạo"
                  value={new Date(station.createdAt).toLocaleDateString("vi-VN")}
                />

              </div>
            </div>

            {/* --- LIST POINTS --- */}
            <div>
              <h3 className="text-lg font-semibold mb-3">🔌 Các điểm sạc thuộc trạm</h3>

              {points.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có điểm sạc nào.</p>
              ) : (
                <div className="space-y-3">
                  {points.map((pt) => (
                    <div
                      key={pt._id}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <p className="font-semibold">{pt.point_number}</p>
                     <p className="text-sm text-gray-500">
  Trạng thái:{" "}
  <span className={getPointStatusColor(pt.point_status)}>
    {getPointStatusText(pt.point_status)}
  </span>
</p>

                      {/* <p className="text-sm text-gray-500">Loại cổng: {pt.connector_type}</p>
                      <p className="text-sm text-gray-500">Công suất: {pt.power_rating} kW</p> */}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </DialogPortal>
    </Dialog>
  );
}

/* Reusable Component */
function InfoBox({ icon, label, value, full, color }) {
  return (
    <div className={`p-3 bg-gray-50 rounded-lg border ${full ? "col-span-2" : ""}`}>
      <p className="text-gray-500 flex items-center gap-2">{icon} {label}</p>
      <p className={`font-semibold ${color || ""}`}>{value}</p>
    </div>
  );
}
