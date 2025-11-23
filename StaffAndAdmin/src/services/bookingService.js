import api from "./api";

export const bookingService = {
  // Tạo booking
  createBooking: async (data) => {
    const response = await api.post("/booking-service/bookings", data);
    return response.data;
  },

  // Lấy tất cả booking
  getAllBookings: async () => {
    const response = await api.get("/booking-service/bookings");
    return response.data;
  },

  // Validate booking trước khi tạo session
  validateBooking: async (data) => {
    const response = await api.post(
      "/booking-service/bookings/validate",
      data
    );
    return response.data;
  },

  // Lấy booking theo ID
  getBookingById: async (id) => {
    const response = await api.get(`/booking-service/bookings/${id}`);
    return response.data;
  },

  // Lấy booking theo booking_code
  getBookingByCode: async (booking_code) => {
    const response = await api.get(
      `/booking-service/bookings/code/${booking_code}`
    );
    return response.data;
  },

  // Lấy booking theo user_id
  getBookingsByUserId: async (user_id) => {
    const response = await api.get(
      `/booking-service/bookings/user/${user_id}`
    );
    return response.data;
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (data) => {
    const response = await api.put(
      "/booking-service/bookings/update_status/",
      data
    );
    return response.data;
  },

  // Hủy booking
  cancelBooking: async (data) => {
    const response = await api.post("/booking-service/bookings/cancel", data);
    return response.data;
  },
};
