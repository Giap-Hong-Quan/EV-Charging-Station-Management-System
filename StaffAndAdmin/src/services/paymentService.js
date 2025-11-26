import api from "./api";

export const paymentService = {
  // -----------------------------------
  // 1. Tạo Payment (POST /create)
  // -----------------------------------
  createPayment: async (data) => {
    const response = await api.post("/payment-service/payment/create", data);
    return response.data;
  },

  // -----------------------------------
  // 2. VNPay Return (GET /vnpay_return)
  // -----------------------------------
  vnpayReturn: async (query) => {
    const response = await api.get("/payment-service/payment/vnpay_return", {
      params: query,
    });
    return response.data;
  },

  // -----------------------------------
  // 3. Lấy tất cả payments (GET /list)
  // -----------------------------------
  getAllPayments: async () => {
    const response = await api.get("/payment-service/payment/list");
    return response.data;
  },

  // -----------------------------------
  // 4. Lấy Payment theo ID (GET /:paymentId)
  // -----------------------------------
  getPaymentById: async (paymentId) => {
    const response = await api.get(
      `/payment-service/payment/${paymentId}`
    );
    return response.data;
  },

  // -----------------------------------
  // 5. Lấy Payment theo Session ID (GET /session/:sessionId)
  // -----------------------------------
  getPaymentsBySession: async (sessionId) => {
    const response = await api.get(
      `/payment-service/payment/session/${sessionId}`
    );
    return response.data;
  },

  // -----------------------------------
  // 6. Lấy Payment theo User ID (GET /user/:userId)
  // -----------------------------------
  getPaymentsByUser: async (userId) => {
    const response = await api.get(
      `/payment-service/payment/user/${userId}`
    );
    return response.data;
  },

  // -----------------------------------
  // 7. Lấy Payment theo Station ID (GET /station/:stationId)
  // -----------------------------------
  getPaymentsByStation: async (stationId) => {
    const response = await api.get(
      `/payment-service/payment/station/${stationId}`
    );
    return response.data;
  },

  // -----------------------------------
  // 8. Kiểm tra trạng thái thanh toán (GET /check/:txnRef)
  // -----------------------------------
  checkPaymentStatus: async (txnRef) => {
    const response = await api.get(
      `/payment-service/payment/check/${txnRef}`
    );
    return response.data;
  },

  // -----------------------------------
  // 9. Thống kê Payment tổng quan (GET /stats/summary)
  // -----------------------------------
  getPaymentStats: async () => {
    const response = await api.get(
      "/payment-service/payment/stats/summary"
    );
    return response.data;
  },

  // -----------------------------------
  // 10. Hủy Payment (PUT /:paymentId/cancel)
  // -----------------------------------
  cancelPayment: async (paymentId) => {
    const response = await api.put(
      `/payment-service/payment/${paymentId}/cancel`
    );
    return response.data;
  },
};
