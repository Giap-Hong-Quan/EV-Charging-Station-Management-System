import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Zap, Clock } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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

const getMarkerColor = (status) => {
  switch (status) {
    case "online":
      return "#10B981"; // xanh
    case "maintenance":
      return "#FBBF24"; // vàng
    case "offline":
      return "#EF4444"; // đỏ
    default:
      return "#6B7280"; // xám
  }
};

// =====================================================================
// 📌 COMPONENT CHÍNH
// =====================================================================
const StationMapView = ({ stations }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  // Token Mapbox
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaG9uZ3F1YW4iLCJhIjoiY21nMzQ4OTFkMWFsdzJxcTVoMTk2bnAyaCJ9.x9Sf5TBdgrhTBKn7lNvsdQ";

  // =====================================================================
  // 🔍 LỌC TRẠM THEO SEARCH
  // =====================================================================
  const filteredStations = stations.filter((s) => {
    if (!searchTerm) return true;
    
    const keyword = removeVietnameseTones(searchTerm);
    const name = removeVietnameseTones(s?.name);
    const address = removeVietnameseTones(s?.address);

    return name.includes(keyword) || address.includes(keyword);
  });

  // =====================================================================
  // 🗺️ KHỞI TẠO MAP
  // =====================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Tạo map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [106.70088, 10.77345],
      zoom: 12,
    });

    // Thêm zoom control
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => mapRef.current && mapRef.current.remove();
  }, []);

  // =====================================================================
  // 📍 VẼ TẤT CẢ MARKERS
  // =====================================================================
  useEffect(() => {
    if (!mapRef.current) return;

    // Xóa markers cũ
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Thêm markers mới
    const bounds = new mapboxgl.LngLatBounds();

    stations.forEach((s) => {
      if (!s.longitude || !s.latitude) return;

      const color = getMarkerColor(s.status);

      // Marker HTML
      const el = document.createElement("div");
      el.style.width = "16px";
      el.style.height = "16px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 0 6px rgba(0,0,0,0.25)";
      el.style.cursor = "pointer";
      el.style.transition = "all 0.2s";

      // Hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Popup nội dung
      const popupHTML = `
        <div style="min-width: 200px;">
          <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 4px;">
            ${s.name}
          </h3>
          <p style="font-size: 13px; color: #666; margin-bottom: 8px;">${s.address}</p>
          <div style="font-size: 12px; color: #555;">
            <p style="margin: 4px 0;"><strong>Trạng thái:</strong> ${getStatusText(s.status)}</p>
            <p style="margin: 4px 0;"><strong>Công suất:</strong> ${s.power_rating} kW</p>
            <p style="margin: 4px 0;"><strong>Cổng:</strong> ${s.connector_type}</p>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 8 }).setHTML(popupHTML);

      // Tạo marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([s.longitude, s.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
      bounds.extend([s.longitude, s.latitude]);
    });

    // Fit bounds nếu có trạm
    if (stations.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [stations]);

  // =====================================================================
  // 🎯 CHỌN TRẠM → BAY ĐẾN VỊ TRÍ
  // =====================================================================
  const handleSelectStation = (station) => {
    setSelectedStation(station);
    setSearchTerm(station.name);
    setShowSuggestions(false);

    if (mapRef.current && station.longitude && station.latitude) {
      mapRef.current.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 16,
        duration: 1500,
        essential: true,
      });

      // Mở popup của marker này
      setTimeout(() => {
        const marker = markersRef.current.find((m) => {
          const lngLat = m.getLngLat();
          return (
            lngLat.lng === station.longitude &&
            lngLat.lat === station.latitude
          );
        });
        if (marker) {
          marker.togglePopup();
        }
      }, 1600);
    }
  };

  // =====================================================================
  // 📌 RENDER
  // =====================================================================
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      {/* 🔍 SEARCH với DROPDOWN - Giới hạn 1/3 chiều rộng */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
        <input
          type="text"
          placeholder="Tìm kiếm trạm sạc..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none"
        />

        {/* DROPDOWN GỢI Ý */}
        {showSuggestions && searchTerm && filteredStations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
            {filteredStations.slice(0, 10).map((station) => (
              <button
                key={station._id}
                onClick={() => handleSelectStation(station)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {station.name}
                    </h4>
                    <p className="text-xs text-slate-600 mb-2">
                      {station.address}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                          station.status === "online"
                            ? "bg-emerald-50 text-emerald-700"
                            : station.status === "maintenance"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            station.status === "online"
                              ? "bg-emerald-500"
                              : station.status === "maintenance"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        ></span>
                        {getStatusText(station.status)}
                      </span>
                      <span className="text-slate-500">
                        <Zap className="w-3 h-3 inline mr-1" />
                        {station.power_rating} kW
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            
            {filteredStations.length > 10 && (
              <div className="px-4 py-2 text-center text-xs text-slate-500 bg-slate-50">
                Còn {filteredStations.length - 10} trạm khác...
              </div>
            )}
          </div>
        )}

        {/* KHÔNG TÌM THẤY */}
        {showSuggestions && searchTerm && filteredStations.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-30">
            <p className="text-sm text-slate-500 text-center">
              Không tìm thấy trạm phù hợp
            </p>
          </div>
        )}
      </div>

      {/* 🗺️ BẢN ĐỒ */}
      <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-300 shadow">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* 📊 LEGEND */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <div>
          Tổng <strong>{stations.length}</strong> trạm
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Bảo trì</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span>Ngừng</span>
          </div>
        </div>
      </div>

      {/* Click outside để đóng dropdown */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowSuggestions(false)}
        ></div>
      )}
    </div>
  );
};

export default StationMapView;