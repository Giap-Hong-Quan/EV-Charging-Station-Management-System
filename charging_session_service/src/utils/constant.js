// src/constants/session.constants.js

export const ChargingSessionStatus = {
  IN_PROGRESS: "IN_PROGRESS",        // Đang sạc
  WAITING_PAYMENT: "WAITING_PAYMENT",// Đợi thanh toán
  PAID: "PAID",                      // Đã thanh toán (chưa hoàn tất logic khác)
  COMPLETED: "COMPLETED",            // Hoàn thành
  CANCELLED: "CANCELLED",            // Hủy
};

export const PaymentMethod = {
  VNPAY: "vnpay",
  CASH: "cash",
};

export const PaymentStatus = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};
