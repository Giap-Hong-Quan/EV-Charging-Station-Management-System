import api from "./api";

export const maintenanceService = {
  //  Tạo Maintenance Log (có upload ảnh)
  createMaintenance: async (formData) => {
    const response = await api.post("/station-service/maintenance/issues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  //  Lấy tất cả bản ghi Maintenance
  getAllMaintenance: async () => {
    const response = await api.get("/station-service/maintenance/issues");
    return response.data;
  },

  //  Lấy 1 bản ghi Maintenance theo ID
  getMaintenanceById: async (id) => {
    const response = await api.get(`/station-service/maintenance/issues${id}`);
    return response.data;
  },

  //  Update Maintenance (có hoặc không có ảnh)
  updateMaintenance: async (id, formData) => {
    const response = await api.put(`/station-service/maintenance/issues${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  //  Update trạng thái Maintenance
  updateMaintenanceStatus: async (id, statusData) => {
    const response = await api.put(
      `/station-service/maintenance/issues/${id}/status`,
      statusData
    );
    return response.data;
  },
    //  Xóa Maintenance
    deleteMaintenance: async (id) => {
      const response = await api.delete(`/station-service/maintenance/issues/${id}`);
      return response.data;
    },
};
