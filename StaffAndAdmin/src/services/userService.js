import api from "./api";

export const userService = {
  // Lấy danh sách users
  getUsers: async () => {
    const response = await api.get("/api/users");
    return response.data;
  },

  // Tạo user mới
  createUser: async (userData) => {
    const response = await api.post("/api/users", userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  // Xóa user
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (formData) => {
    try {
      const response = await api.put("/api/v1/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/v1/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
