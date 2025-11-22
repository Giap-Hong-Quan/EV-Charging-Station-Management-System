  import React, { useEffect, useState } from 'react'
  import { stationService } from "@/services/stationService";
  import { MapPin, CheckCircle, Wrench, AlertCircle, List, Map } from "lucide-react";
import StationMapView from '@/components/admin/StationMapView';
import StationListView from '@/components/admin/StationListView';
import { useModalStore } from '@/store/modalStore';
 
  const StationAdmin = () => {
    const [stations, setStations] = useState([]);
    const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    maintenance: 0,
    });
  const [viewMode, setViewMode] = useState(() => {
  return localStorage.getItem("viewMode") || "map";
});

useEffect(() => {
  localStorage.setItem("viewMode", viewMode);
}, [viewMode]);
 // 'map' | 'list'
  const modal = useModalStore((s) => s.modal);
 // API load danh sách
  const fetchStations = async () => {
    try {
      const res = await stationService.getAllStations();
      setStations(res.stations || []);
      setStats({
        total: res.count || 0,
        online: res.countOnline || 0,
        offline: res.countOffline || 0,
        maintenance: res.countMaintenance || 0,
      });
    } catch (err) {
      console.error("Lỗi load stations:", err);
    }
  };

  // Lần đầu load
  useEffect(() => {
    fetchStations();
  }, []);

  // 🔥 Khi modal đóng → reload lại data
  useEffect(() => {
    // modal === null nghĩa là vừa đóng modal
    if (modal === null) {
      fetchStations();
    }
  }, [modal]);

//xOa
  const deleteStation = async (id) => {
    try {
      await stationService.deleteStation(id);
      setStations(prev => prev.filter(st => st._id !== id));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
      setStats(prev => ({
        ...prev,
        online: prev.online - 1,
      }));
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };
  // thêm 

    return (
      <div>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Tổng số trạm */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-sm text-slate-600 font-medium">Tổng số trạm</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-11 h-11 bg-slate-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-slate-700" />
            </div>
          </div>

          {/* Hoạt động */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-sm text-emerald-700 font-medium">Hoạt động</p>
              <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.online}</p>
            </div>
            <div className="w-11 h-11 bg-emerald-200 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-700" />
            </div>
          </div>

          {/* Bảo trì */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-sm text-amber-700 font-medium">Bảo trì</p>
              <p className="text-3xl font-bold text-amber-700 mt-1">{stats.maintenance}</p>
            </div>
            <div className="w-11 h-11 bg-amber-200 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-amber-700" />
            </div>
          </div>

          {/* Ngoại tuyến */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-sm text-rose-700 font-medium">Ngoại tuyến</p>
              <p className="text-3xl font-bold text-rose-700 mt-1">{stats.offline}</p>
            </div>
            <div className="w-11 h-11 bg-rose-200 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-rose-700" />
            </div>
          </div>

        </div>
        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 mt-4 w-fit">
          <button
            onClick={() => setViewMode("map")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === "map"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Map className="w-4 h-4" />
            Bản đồ
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="w-4 h-4" />
            Danh sách
          </button>
        </div>
        <div className="mt-6">
        {viewMode === "map" ? (
          <StationMapView stations={stations} />
        ) : (
          <StationListView stations={stations} deleteStation={deleteStation} fetchStations={fetchStations} />
        )}
      </div>
      </div>
    )
  }

  export default StationAdmin