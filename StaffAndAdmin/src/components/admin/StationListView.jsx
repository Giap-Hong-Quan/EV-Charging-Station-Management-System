import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Zap,
  DollarSign,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import UpdateStationModal from "./UpdateStationModal";
import ViewStation from "./ViewStation";

// =====================================================================
// 🧹 Hàm bỏ dấu + lowercase + chống undefined
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
// 🎨 Trạng thái
// =====================================================================
const getStatusText = (status) => {
  switch (status) {
    case "online":
      return "Hoạt động";
    case "maintenance":
      return "Bảo trì";
    case "offline":
      return "Ngừng hoạt động";
    default:
      return status;
  }
};

const getStatusColors = (status) => {
  switch (status) {
    case "online":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "maintenance":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "offline":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

// =====================================================================
// 📌 COMPONENT CHÍNH
// =====================================================================
const StationListView = ({ stations, searchTerm, setSearchTerm, deleteStation, fetchStations }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showViewStationModal, setShowViewStationModal] = useState(false);

const [showUpdateStationModal, setShowUpdateStationModal] = useState(false);
  // =====================================================================
  // 🔍 SEARCH + FILTER LOGIC
  // =====================================================================
const filteredStations = stations.filter((s) => {
  const keyword = removeVietnameseTones(searchTerm);

  const name = removeVietnameseTones(s?.name);
  const address = removeVietnameseTones(s?.address);
  const connector = removeVietnameseTones(s?.connector_type);
  const status = removeVietnameseTones(getStatusText(s?.status));

  const matchText =
    name.includes(keyword) ||
    address.includes(keyword) ||
    connector.includes(keyword) ||
    status.includes(keyword);

  const matchFilter =
    filterStatus === "all" ? true : s.status === filterStatus;

  return matchText && matchFilter;
});


  // =====================================================================
  // 📌 RENDER
  // =====================================================================
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex items-center gap-3 mb-4">
        
        {/* Ô tìm kiếm */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trạm sạc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500"
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
              {["all", "online", "maintenance", "offline"].map((status) => (
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📋 BẢNG DANH SÁCH */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Tên trạm</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Công suất</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Điểm sạc</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Loại cổng</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Giá/kWh</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredStations.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50">

                {/* TÊN TRẠM */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-violet-600" />
                      <p className="font-semibold text-slate-900">{s.name}</p>
                  </div>
                </td>

                {/* ĐỊA CHỈ */}
                <td className="px-6 py-4 text-slate-600">{s.address}</td>

                {/* TRẠNG THÁI */}
                <td className="px-6 py-4 ">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColors(
                      s.status
                    )}`}
                  >
                    {getStatusText(s.status)}
                  </span>
                </td>

                {/* CÔNG SUẤT */}
                <td className="px-6 py-4 text-left">
                    <span className="font-semibold">{s.power_rating} kW</span>
                </td>

                {/* ĐIỂM SẠC */}
                <td className="px-6 py-4 text-left">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">
                      {s.available_points}/{s.total_points}
                    </span>
                    <div className="w-20 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${
                            (s.available_points / s.total_points) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>

                {/* CỔNG */}
                <td className="px-6 py-4 text-left">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                    {s.connector_type}
                  </span>
                </td>

                {/* GIÁ */}
                <td className="px-6 py-4 text-left">
                  <div className="flex justify-start items-center gap-1">
                        
                    <span className="font-semibold">
                      {s.price_per_kwh.toLocaleString()}đ
                    </span>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <Eye onClick={()=> {
                      setSelectedStationId(s._id);
                      setShowViewStationModal(true);
                    }} className="w-5 h-5 text-slate-400 hover:text-violet-600 cursor-pointer" />
                    <Edit onClick={()=>{setShowUpdateStationModal(!showUpdateStationModal); setSelectedStationId(s._id);}} className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    <Trash2 onClick={()=>deleteStation(s._id)} className="w-5 h-5 text-slate-400 hover:text-rose-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}

            {/* EMPTY */}
            {filteredStations.length === 0 && (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-500">
                  Không tìm thấy trạm phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UpdateStationModal
        open={showUpdateStationModal}
        onOpenChange={setShowUpdateStationModal}
        stationId={selectedStationId}
        onUpdated={fetchStations}
      />
 <ViewStation
  open={showViewStationModal}
  onOpenChange={setShowViewStationModal}
  stationId={selectedStationId}
/>

        {/* Nội dung xem thông tin trạm */}
      
    </div>
  );
};

export default StationListView;
