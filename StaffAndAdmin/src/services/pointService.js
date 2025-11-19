import api from "./api";

export const pointService = {
  // Tạo Charging Point
  createPoint: async (data) => {
    const response = await api.post("/station-service/points", data);
    return response.data;
  },

  // Lấy tất cả Charging Points
  getAllPoints: async () => {
    const response = await api.get("/station-service/points");
    return response.data;
  },

  // Lấy 1 Charging Point theo ID
  getPointById: async (id) => {
    const response = await api.get(`/station-service/points/${id}`);
    return response.data;
  },

  // Cập nhật Charging Point
  updatePoint: async (id, data) => {
    const response = await api.put(`/station-service/points/${id}`, data);
    return response.data;
  },

  // Xóa Charging Point
  deletePoint: async (id) => {
    const response = await api.delete(`/station-service/points/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái của Point (PATCH /:id/status)
  updatePointStatus: async (id, statusData) => {
    const response = await api.patch(
      `/station-service/points/${id}/status`,
      statusData
    );
    return response.data;
  },

  // Lấy danh sách point theo stationId (GET /:stationId/points)
  getPointsByStationId: async (stationId) => {
    const response = await api.get(
      `/station-service/points/${stationId}/points`
    );
    return response.data;
  },
};
