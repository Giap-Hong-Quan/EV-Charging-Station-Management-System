import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Zap,
  Building,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";

import { toast } from "sonner";
import { maintenanceService } from "@/services/maintenanceService";
import { stationService } from "@/services/stationService";
import { pointService } from "@/services/pointService";

// Bỏ dấu tiếng Việt
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

// Trạng thái
const getStatusText = (status) =>
  status === "resolved" ? "Đã giải quyết" : "Đã báo cáo";

const getStatusColors = (status) =>
  status === "resolved"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

const IssuesAdmin = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [stations, setStations] = useState([]);
  const [points, setPoints] = useState([]);

  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const m = await maintenanceService.getAllMaintenance();
      const s = await stationService.getAllStations();
      const p = await pointService.getAllPoints();

      setMaintenances(m.maintenances || []);
      setFiltered(m.maintenances || []);
      setStations(s.stations || []);
      setPoints(p || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helpers
  const getStationName = (id) =>
    stations.find((s) => s._id === id)?.name || "—";

  const getPointNumber = (id) =>
    points.find((p) => p._id === id)?.point_number || "—";

  // Search + Filter logic
  useEffect(() => {
    const keyword = removeVietnameseTones(search);
    let list = [...maintenances];

    list = list.filter((m) => {
      const fields = [
        removeVietnameseTones(m.issue_type || ""),
        removeVietnameseTones(getStationName(m.station_id)),
        removeVietnameseTones(m.description || ""),
        removeVietnameseTones(getStatusText(m.status)),
        String(getPointNumber(m.point_id)),
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all" ? true : m.status === filterStatus;

      return matchText && matchFilter;
    });

    setFiltered(list);
  }, [search, filterStatus, maintenances]);

  // Delete
  const handleDelete = async (id) => {
    try {
      await maintenanceService.deleteMaintenance(id);
      toast.success("Đã xóa sự cố!");
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xóa sự cố",err);
    }
  };

  // Toggle status
const toggleStatus = async (item) => {
  try {
    const newStatus = item.status === "resolved" ? "reported" : "resolved";

    // Gọi API update
    await maintenanceService.updateMaintenanceStatus(
      item._id,
      { status: newStatus }
    );

    // Update tại chỗ trong state (KHÔNG fetch lại toàn bộ)
    setMaintenances((prev) =>
      prev.map((m) =>
        m._id === item._id ? { ...m, status: newStatus } : m
      )
    );

    setFiltered((prev) =>
      prev.map((m) =>
        m._id === item._id ? { ...m, status: newStatus } : m
      )
    );

    toast.success("Cập nhật trạng thái thành công!");
    
  } catch (err) {
    console.error(err);
    toast.error("Lỗi khi cập nhật trạng thái");
  }
};
;

  if (loading) return <p className="p-6">Đang tải...</p>;

  // Count
  const total = maintenances.length;
  const reported = maintenances.filter((m) => m.status === "reported").length;
  const resolved = maintenances.filter((m) => m.status === "resolved").length;

  return (
    <div className="p-4">
      {/* STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-slate-50 p-4 rounded-xl border flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">Tổng sự cố</p>
            <p className="text-3xl font-semibold">{total}</p>
          </div>
          <AlertTriangle className="w-10 h-10 text-slate-600" />
        </div>

        <div className="bg-rose-50 p-4 rounded-xl border flex justify-between items-center">
          <div>
            <p className="text-sm text-rose-700">Đã báo cáo</p>
            <p className="text-3xl font-semibold text-rose-700">{reported}</p>
          </div>
          <AlertTriangle className="w-10 h-10 text-rose-700" />
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border flex justify-between items-center">
          <div>
            <p className="text-sm text-emerald-700">Đã giải quyết</p>
            <p className="text-3xl font-semibold text-emerald-700">
              {resolved}
            </p>
          </div>
          <CheckCircle className="w-10 h-10 text-emerald-700" />
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white border rounded-xl p-4 mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border bg-slate-50"
            placeholder="Tìm kiếm sự cố..."
          />
        </div>

        <div className="relative">
          <button
            className="px-4 py-2 bg-slate-50 border rounded-lg flex items-center gap-2"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="w-4 h-4" /> Lọc
            <ChevronDown
              className={`w-4 h-4 transition ${showFilter ? "rotate-180" : ""}`}
            />
          </button>

          {showFilter && (
            <div className="absolute mt-2 right-0 bg-white border rounded-xl p-2 shadow-md w-40">
              {["all", "reported", "resolved"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setFilterStatus(s);
                    setShowFilter(false);
                  }}
                  className={`block w-full px-3 py-2 rounded-lg text-left text-sm ${
                    filterStatus === s
                      ? "bg-violet-50 text-violet-700"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {s === "all" ? "Tất cả" : getStatusText(s)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* GRID CARD VIEW */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-xl border shadow-sm overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 bg-slate-100 relative">
              {m.image_url ? (
                <img
                  src={m.image_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                </div>
              )}

              {/* STATUS BADGE */}
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full border font-medium ${getStatusColors(
                  m.status
                )}`}
              >
                {getStatusText(m.status)}
              </span>
            </div>

            <div className="p-4">
              {/* STATION */}
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Building className="w-4 h-4 text-indigo-600" />
                {getStationName(m.station_id)}
              </div>

              {/* POINT */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Zap className="w-3 h-3" />
                Điểm sạc #{getPointNumber(m.point_id)}
              </div>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                {m.description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                </div>

                <div className="flex items-center gap-2">
                  {/* CHECKBOX */}
                  <label className="flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.status === "resolved"}
                      onChange={() => toggleStatus(m)}
                    />
                    Hoàn thành
                  </label>

                  {/* DELETE */}
                  <button
                  type="button"
                    onClick={() => handleDelete(m._id)}
                    className="p-2 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-center py-12 text-slate-600">
          Không có sự cố nào
        </p>
      )}
    </div>
  );
};

export default IssuesAdmin;
