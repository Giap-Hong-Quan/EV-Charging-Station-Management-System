import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X, Mail, MapPin, Power, Zap, Settings, Calendar, Plug } from "lucide-react";

export default function ViewStaff({ open, onOpenChange, staff, station }) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>

        {/* Overlay */}
        <DialogOverlay
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 bg-black/40 animate-fadeIn z-40"
        />

        {/* Drawer Panel */}
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
          {/* HEADER - Fixed */}
          <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-semibold">Thông tin nhân viên</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* BODY - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* --- THÔNG TIN NHÂN VIÊN --- */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={staff.avatar || "/default-avatar.png"}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                  <p className="text-xl font-semibold">{staff.full_name}</p>
                  <p className="text-gray-500 text-sm">{staff.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Địa chỉ</p>
                    <p className="font-medium">{staff.address || "—"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Xác thực</p>
                    <p className="font-medium">
                      {staff.social_provider ? `🔗 ${staff.social_provider}` : "Email / Password"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Ngày tạo</p>
                    <p className="font-medium">
                      {new Date(staff.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- THÔNG TIN TRẠM --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4">⚡ Thông tin trạm quản lý</h3>

              {!station ? (
                <p className="text-gray-500">Nhân viên chưa thuộc trạm nào.</p>
              ) : (
                <div className="space-y-4">

                  <div>
                    <p className="text-xl font-semibold">{station.name}</p>
                    <p className="text-gray-500">{station.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">

                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-500 flex items-center gap-2">
                        <Plug className="w-4 h-4" /> Loại cổng
                      </p>
                      <p className="font-semibold">{station.connector_type}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-500 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Công suất
                      </p>
                      <p className="font-semibold">{station.power_rating} kW</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-500 flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Số cổng
                      </p>
                      <p className="font-semibold">{station.total_points}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-500 flex items-center gap-2">
                        <Power className="w-4 h-4" /> Cổng trống
                      </p>
                      <p className="font-semibold">{station.available_points}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border col-span-2">
                      <p className="text-gray-500 flex items-center gap-2">
                        💵 Giá mỗi kWh
                      </p>
                      <p className="font-semibold">{station.price_per_kwh.toLocaleString()} đ</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border col-span-2">
                      <p className="text-gray-500">Trạng thái</p>
                      <p
                        className={`font-semibold ${
                          station.status === "online" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {station.status}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border col-span-2">
                      <p className="text-gray-500">Ngày tạo</p>
                      <p className="font-semibold">
                        {new Date(station.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </DialogPortal>
    </Dialog>
  );
}