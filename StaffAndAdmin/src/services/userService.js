import api from "./api";

export const userService = {
  // Lấy danh sách users
  getUsers: async () => {
    const response = await api.get("/user-service/users");
    return response.data;
  },
  // Lấy danh sách users
  getUserById: async (id) => {
    const response = await api.get(`/user-service/users/${id}`);
    return response.data;
  },
  // Tạo user mới
  createUser: async (userData) => {
    const response = await api.post("/user-service/users", userData);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id, userData) => {
    const response = await api.put(`/user-service/users/${id}`, userData);
    return response.data;
  },

  // Xóa user
  deleteUser: async (id) => {
    const response = await api.delete(`/user-service/users/${id}`);
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (formData) => {
    try {
      const response = await api.put("/user-service/profile", formData, {
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
      const response = await api.get("/user-service/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUsersByRole: async (role_id) => {
  const response = await api.get(`/user-service/users-by-role?role_id=${role_id}`);
  return response.data.users;
}
};
