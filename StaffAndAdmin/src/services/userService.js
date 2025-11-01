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
};
