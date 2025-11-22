import React, { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Users,
  CheckCircle,
  Ban,
  Building,
  Plus,
  Eye,
} from "lucide-react";
import { userService } from "@/services/userService";
import { stationService } from "@/services/stationService";

import AddStaffModal from "@/components/admin/AddStaffModal";
import EditStaffModal from "@/components/admin/EditStaffModal";
import { toast } from "sonner";
import ViewStaff from "@/components/admin/ViewStaff";

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

const StaffAdmin = () => {
  const [staffs, setStaffs] = useState([]);
  const [stations, setStations] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [showViewStaff,setShowViewStaff] = useState(false);
  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // =====================================================================
  // 🔥 Fetch Staff (role_id = 2)
  // =====================================================================
  const fetchStaff = async () => {
    const res = await userService.getUsersByRole(2);
    setStaffs(res);
    setFilteredStaffs(res);
  };

  // Fetch Stations
  const fetchStations = async () => {
    const data = await stationService.getAllStations();
    setStations(data.stations);
  };

  useEffect(() => {
    fetchStaff();
    fetchStations();
  }, []);

  // =====================================================================
  // 🔍 SEARCH + FILTER LOGIC
  // =====================================================================
  useEffect(() => {
    let temp = [...staffs];

    const keyword = removeVietnameseTones(searchTerm);

    temp = temp.filter((u) => {
      const active = u.sessions?.length > 0 ? "active" : "inactive";
      const stationName = getStationName(u.station_id);

      const fields = [
        removeVietnameseTones(u.full_name),
        removeVietnameseTones(u.email),
        removeVietnameseTones(u.address),
        removeVietnameseTones(stationName),
        active,
      ];

      const matchText = fields.some((f) => f.includes(keyword));
      const matchFilter =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
          ? u.sessions?.length > 0
          : u.sessions?.length === 0;

      return matchText && matchFilter;
    });

    setFilteredStaffs(temp);
  }, [searchTerm, filterStatus, staffs]);

  const getStationName = (id) =>
    stations.find((s) => s._id === id)?.name || "—";

  const handleDelete = async (id) => {
    await userService.deleteUser(id);
    toast.success("Đã xóa nhân viên thành công");
    fetchStaff();
  };

  // =====================================================================
  // 📌 TÍNH TOÁN THỐNG KÊ
  // =====================================================================
  const total = staffs.length;
  const activeCount = staffs.filter((u) => u.sessions?.length > 0).length;
  const inactiveCount = total - activeCount;

  // =====================================================================
  // RENDER UI
  // =====================================================================
  return (
    <div>
      {/* ============================
          📊 STATS - Giống Station
      ============================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Tổng số staff */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-slate-600 font-medium">Tổng số nhân viên</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* Hoạt động */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-emerald-700 font-medium">Hoạt động</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">{activeCount}</p>
          </div>
          <div className="w-11 h-11 bg-emerald-200 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
        </div>

        {/* Không hoạt động */}
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-sm text-rose-700 font-medium">Không hoạt động</p>
            <p className="text-3xl font-bold text-rose-700 mt-1">{inactiveCount}</p>
          </div>
          <div className="w-11 h-11 bg-rose-200 rounded-xl flex items-center justify-center">
            <Ban className="w-6 w-6 text-rose-700" />
          </div>
        </div>

        {/* Ô thứ 4 để trống */}
        <div></div>
      </div>

      {/* ============================
          🎨 CARD CHỨA SEARCH + TABLE
      ============================= */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mt-6">
        
        {/* 🔍 SEARCH + FILTER - Giống Station */}
        <div className="flex items-center gap-3 mb-4">
          
          {/* Ô tìm kiếm */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thông tin</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Xác thực</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạm quản lý</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStaffs.map((u) => {
                const isActive = u.sessions?.length > 0;

                return (
                  <tr key={u.id} className="hover:bg-slate-50">
                    {/* THÔNG TIN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || "/default-avatar.png"}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={u.full_name}
                        />
                        <p className="font-semibold text-slate-900">{u.full_name}</p>
                      </div>
                    </td>

                    {/* LIÊN HỆ */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {u.email}
                        </div>
                        {u.address && (
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{u.address}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* XÁC THỰC */}
                    <td className="px-6 py-4 ">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                          u.social_provider === "google"
                            ? " text-slate-700 "
                            : " text-slate-700 border-slate-200"
                        }`}
                      >
                        {u.social_provider ? `🔗 ${u.social_provider}` : "🔐 Email/Pass"}
                      </span>
                    </td>

                    {/* TRẠNG THÁI */}
                    <td className="px-6 py-4 ">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>

                    {/* TRẠM QUẢN LÝ */}
                    <td className="px-6 py-4 ">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Building className="w-4 h-4 " />
                        <span className="font-medium">{getStationName(u.station_id)}</span>
                      </div>
                    </td>

                    {/* NGÀY TẠO */}
                    <td className="px-6 py-4  text-sm text-slate-600">
                      {new Date(u.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    {/* THAO TÁC */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <Eye onClick={()=> { setSelectedUser(u); setShowViewStaff(true); }} className="w-5 h-5 text-slate-400 hover:text-violet-600 cursor-pointer" />
                        <Edit
                          className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedUser(u);
                            setOpenEdit(true);
                          }}
                        />
                        <Trash2
                          className="w-5 h-5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                          onClick={() => handleDelete(u.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE */}
              {filteredStaffs.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-500">
                    Không tìm thấy nhân viên phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    <ViewStaff
  open={showViewStaff}
  onOpenChange={setShowViewStaff}
  staff={selectedUser}
  station={stations.find(s => s._id === selectedUser?.station_id)}
/>
      {/* ADD MODAL */}
      <AddStaffModal
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCreated={fetchStaff}
      />

      {/* EDIT MODAL */}
      <EditStaffModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        staffId={selectedUser?.id}
        onUpdated={fetchStaff}
/>
    </div>
  );
};

export default StaffAdmin;