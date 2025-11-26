import AddChargingPointModal from '@/components/admin/AddChargingPointModal';
import EditChargingPointModal from '@/components/admin/EditChargingPointModal';
import { pointService } from '@/services/pointService';
import { stationService } from '@/services/stationService';
import { Building, ChevronDown, Circle, Clock, Edit, Filter, Plus, Search, Trash2, Wrench, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
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
const getStatusText = (status) => {
  switch (status) {
    case "Empty":
      return "Trống";
    case "Charging":
      return "Đang sạc";
    case "Reservation":
      return "Đã đặt";
    case "Maintenance":
      return "Bảo trì";
    default:
      return status;
  }
};
const getStatusColors = (status) => {
  switch (status) {
    case "Empty":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "Charging":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Reservation":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Maintenance":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};
const PointAdmin = () => {
    const [points, setPoints] = useState([]);
  const [stations, setStations] = useState([]);
  const [filteredPoints, setFilteredPoints] = useState([]);

  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);


    const fetchPoints = async () => {
    try {
      setLoading(true);
      const res = await pointService.getAllPoints();
      setPoints(res);
      setFilteredPoints(res);
      console.log("Fetched points:", res);
    } catch (err) {
      console.error("Lỗi fetch charging points:", err);
    } finally {
      setLoading(false);
    }
  };
    // Fetch Stations
  const fetchStations = async () => {
    try {
      const data = await stationService.getAllStations();
      setStations(data.stations);
      console.log("Fetched stations:", data.stations);
    } catch (err) {
      console.error("Lỗi fetch stations:", err);
    }
  };

  useEffect(() => {
    fetchPoints();
    fetchStations();
  }, []);

  useEffect(() => {
    let temp = [...points];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((p) => {
      const stationName = getStationName(p.station_id);
      const statusText = getStatusText(p.point_status);

      const fields = [
        String(p.point_number),
        removeVietnameseTones(stationName),
        removeVietnameseTones(statusText),
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all" ? true : p.point_status === filterStatus;

      return matchText && matchFilter;
    });
    
    setFilteredPoints(temp);
  }, [searchTerm, filterStatus, points]);
  const getStationName = (id) =>
  stations.find((s) => s._id === id)?.name || "—";
// 🗑 Delete charging point
  // =====================================================================
  const handleDelete = async (id) => {
    try {
      await pointService.deletePoint(id);
      toast.success("Đã xóa điểm sạc thành công");
      fetchPoints();
    } catch (err) {
      console.error("Lỗi xóa:", err);
      toast.error("Lỗi khi xóa điểm sạc");
    }
  };
   if (loading) return <p className="p-6">Đang tải...</p>;

     const total = points.length;
  const emptyCount = points.filter((p) => p.point_status === "Empty").length;
  const chargingCount = points.filter(
    (p) => p.point_status === "Charging"
  ).length;
  const reservationCount = points.filter(
    (p) => p.point_status === "Reservation"
  ).length;
  const maintenanceCount = points.filter(
    (p) => p.point_status === "Maintenance"
  ).length;

  return (
     <div>
      {/* ============================
          📊 STATS - Giống Driver (5 cards)
      ============================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        {/* Tổng số điểm sạc */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-slate-600 font-medium">Tổng điểm sạc</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Trống */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-slate-600 font-medium">Trống</p>
            <p className="text-3xl font-bold text-slate-700 mt-1">
              {emptyCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
            <Circle className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Đang sạc */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-emerald-700 font-medium">Đang sạc</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">
              {chargingCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-200 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* Đã đặt */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-blue-700 font-medium">Đã đặt</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              {reservationCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-blue-200 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-700" />
          </div>
        </div>

        {/* Bảo trì */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-amber-700 font-medium">Bảo trì</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">
              {maintenanceCount}
            </p>
          </div>
          <div className="w-11 h-11 bg-amber-200 rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-amber-700" />
          </div>
        </div>
      </div>

      {/* ============================
          🎨 CARD CHỨA SEARCH + TABLE
      ============================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
        {/* 🔍 SEARCH + FILTER - Giống Driver */}
        <div className="flex items-center gap-3 mb-4">
          {/* Ô tìm kiếm */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm điểm sạc..."
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
                {["all", "Empty", "Charging", "Reservation", "Maintenance"].map(
                  (status) => (
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
                      {status === "all" ? "Tất cả" : getStatusText(status)}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* BUTTON Thêm */}
          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm
          </button>
        </div>

        {/* 📋 TABLE */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Số điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Trạm sạc
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Ngày tạo
                </th>
              
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPoints.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50">
                  {/* SỐ ĐIỂM */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-violet-600" />
                      </div>
                      <p className="font-semibold text-slate-900">
                        Điểm #{p.point_number}
                      </p>
                    </div>
                  </td>

                  {/* TRẠM SẠC */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">
                        {getStationName(p.station_id)}
                      </span>
                    </div>
                  </td>

                  {/* TRẠNG THÁI */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColors(
                        p.point_status
                      )}`}
                    >
                      {getStatusText(p.point_status)}
                    </span>
                  </td>

                  {/* NGÀY TẠO */}
                  <td className="px-6 py-4 text-left text-sm text-slate-600">
                    {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                  </td>

              

                  {/* THAO TÁC */}
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Edit
                        className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedPoint(p);
                          setOpenEdit(true);
                        }}
                      />
                      <Trash2
                        className="w-5 h-5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                        onClick={() => handleDelete(p._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}
              {filteredPoints.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500">
                    Không tìm thấy điểm sạc phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      <AddChargingPointModal
        open={openAdd}
        onOpenChange={setOpenAdd}
        stations={stations}
        onCreated={fetchPoints}
      />

      {/* EDIT MODAL */}
      <EditChargingPointModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        point={selectedPoint}
        stations={stations}
        onUpdated={fetchPoints}
      />
    </div>
  );

}

export default PointAdmin