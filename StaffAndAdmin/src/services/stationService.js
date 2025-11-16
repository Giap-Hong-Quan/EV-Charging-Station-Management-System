import api from "./api";

export const stationService = {
  // Tạo Station
  createStation: async (data) => {
    const response = await api.post("/station-service/stations", data);
    return response.data;
  },

  // Lấy tất cả Stations
  getAllStations: async () => {
    const response = await api.get("/station-service/stations");
    return response.data;
  },

  // Tìm kiếm Stations theo keyword (?keyword=...)
  searchStations: async (keyword) => {
    const response = await api.get(`/station-service/stations/search`, {
      params: { keyword },
    });
    return response.data;
  },

  // Lấy 1 Station theo ID
  getStationById: async (id) => {
    const response = await api.get(`/station-service/stations/${id}`);
    return response.data;
  },

  // Cập nhật Station
  updateStation: async (id, data) => {
    const response = await api.put(`/station-service/stations/${id}`, data);
    return response.data;
  },

  // Xóa Station
  deleteStation: async (id) => {
    const response = await api.delete(`/station-service/stations/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái Station (PATCH /:id/status)
  updateStationStatus: async (id, statusData) => {
    const response = await api.patch(
      `/station-service/stations/${id}/status`,
      statusData
    );
    return response.data;
  },
};
