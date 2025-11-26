import api from "./api";

export const chargingSessionService = {
  // -------------------------------
  // 1. Tạo Session từ Booking
  // -------------------------------
  createSessionFromBooking: async (data) => {
    const response = await api.post(
      "/session-service/sessions/from-booking",
      data
    );
    return response.data;
  },

  // -------------------------------
  // 2. Tạo Session thủ công (staff)
  // -------------------------------
  createManualSession: async (data) => {
    const response = await api.post(
      "/session-service/sessions/manual",
      data
    );
    return response.data;
  },

  // -------------------------------
  // 3. Lấy session theo ID
  // -------------------------------
  getSessionById: async (id) => {
    const response = await api.get(`/session-service/sessions/${id}`);
    return response.data;
  },

  // -------------------------------
  // 4. Lấy session theo Station ID
  // -------------------------------
  getSessionsByStation: async (stationId) => {
    const response = await api.get(
      `/session-service/sessions/station/${stationId}`
    );
    return response.data;
  },

  // -------------------------------
  // 5. Lấy toàn bộ Session (admin)
  // -------------------------------
  getAllSessions: async () => {
    const response = await api.get("/session-service/sessions");
    return response.data;
  },

  // -------------------------------
  // 6. Lấy Session theo User ID
  // -------------------------------
  getSessionsByUser: async (userId) => {
    const response = await api.get(
      `/session-service/sessions/user/${userId}`
    );
    return response.data;
  },

  // -------------------------------
  // 7. Kết thúc session
  // PUT /:id/end
  // -------------------------------
  endSession: async (id, data) => {
    const response = await api.put(
      `/session-service/sessions/${id}/end`,
      data
    );
    return response.data;
  },

  // -------------------------------
  // 8. Cập nhật thanh toán
  // PUT /:id/payment
  // -------------------------------
  updateSessionPayment: async (id, data) => {
    const response = await api.put(
      `/session-service/sessions/${id}/payment`,
      data
    );
    return response.data;
  },
};
