import api from "./api";

export const authService = {
  // Đăng nhập
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },

  // Lấy thông tin user profile
  getProfile: async () => {
    const response = await api.get("/api/v1/profile");
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await api.post("/api/v1/auth/forgot-password", { email });
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (token, newPassword) => {
    const response = await api.post(
      "/api/v1/auth/reset-password",
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    try {
      const token = localStorage.getItem("token");

      // Chỉ gọi API logout nếu có token
      if (token) {
        const response = await api.post("/api/v1/auth/logout");

        // Luôn xóa dữ liệu local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return response.data;
      } else {
        // Nếu không có token, vẫn xóa dữ liệu local
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return { message: "Logged out successfully" };
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Ngay cả khi API fail, vẫn xóa dữ liệu local
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Google login
  googleLogin: async (googleToken) => {
    const response = await api.post("/api/v1/auth/social/google", {
      token: googleToken,
    });
    return response.data;
  },

  // Test kết nối backend
  testConnection: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};
