// src/routes/paymentRouter.js
import express from "express";
import {
  createPayment,
  vnpayReturn,
  getAllPayments,
  getPaymentById,
  getPaymentsBySession,
  getPaymentsByUser,
  getPaymentsByStation,
  checkPaymentStatus,
  getPaymentStats,
  cancelPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create", createPayment);
router.get("/vnpay_return", vnpayReturn);
router.get("/list", getAllPayments);
router.get("/:paymentId", getPaymentById);                // Lấy payment theo ID
router.get("/session/:sessionId", getPaymentsBySession);  // Lấy payments theo session
 router.get("/user/:userId", getPaymentsByUser);           // Lấy payments theo user
router.get("/station/:stationId", getPaymentsByStation);  // Lấy payments theo station

// // === Kiểm tra và thống kê ===
router.get("/check/:txnRef", checkPaymentStatus);         // Kiểm tra trạng thái payment
 router.get("/stats/summary", getPaymentStats);            // Thống kê tổng quan

// // === Hành động ===
router.put("/:paymentId/cancel", cancelPayment);          // Hủy payment
export default router;
