// src/controllers/paymentController.js
import Payment from "../models/payment.js";
import { generateVNPayUrl, sortObject } from "../utils/vnpay.js";
import crypto from "crypto";
import querystring from "qs";

// Tạo giao dịch thanh toán
export const createPayment = async (req, res) => {
  try {
    const { sessionId, userId, stationId, amount, method } = req.body;

    console.log("📝 Create payment request:", { sessionId, userId, stationId, amount, method });

    if (!sessionId  || !stationId || !amount || !method) {
      return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
    }

    const paymentId = "PAY_" + Date.now();
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "127.0.0.1";

    // ======================
    // 1. Thanh toán COD
    // ======================
    if (method === "COD") {
      const paymentData = {
        paymentId,
        sessionId,
        userId: userId || null,
        stationId,
        amount,
        method,
        status: "success",
      };

      console.log("💾 Saving COD payment to DB...", paymentData);

      const payment = await Payment.create(paymentData);

      console.log("✅ COD payment saved to DB:", payment._id);

      return res.json({
        status: "success",
        message: "Thanh toán COD thành công",
        paymentId: payment.paymentId,
        sessionId: payment.sessionId,
      });
    }

    // ======================
    // 2. Thanh toán VNPAY
    // ======================
    if (method === "VNPAY") {
      const { paymentUrl, txnRef } = generateVNPayUrl(
        sessionId,
        amount,
        ipAddr
      );

      const paymentData = {
        paymentId,
        sessionId,
        userId,
        stationId,
        amount,
        method,
        txnRef,
        status: "pending",
      };

      console.log("💾 Saving VNPAY payment to DB...", paymentData);

      const payment = await Payment.create(paymentData);

      console.log("✅ VNPAY payment saved to DB:", {
        _id: payment._id,
        paymentId: payment.paymentId,
        txnRef: payment.txnRef,
        status: payment.status
      });

      // Verify lại từ DB
      const savedPayment = await Payment.findOne({ txnRef });
      console.log("🔍 Verify from DB:", savedPayment ? "FOUND ✅" : "NOT FOUND ❌");

      return res.json({
        status: "pending",
        paymentUrl,
        paymentId: payment.paymentId,
        sessionId: payment.sessionId,
        txnRef: payment.txnRef,
      });
    }

    return res.status(400).json({ error: "Phương thức thanh toán không hợp lệ" });
  } catch (error) {
    console.error("❌ createPayment error:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      error: error.message,
      code: error.code // Để xem lỗi MongoDB nếu có
    });
  }
};

// API để list tất cả payments (để debug)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(20);
    
    return res.json({
      total: payments.length,
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        sessionId: p.sessionId,
        amount: p.amount,
        method: p.method,
        status: p.status,
        txnRef: p.txnRef,
        createdAt: p.createdAt,
      }))
    });
  } catch (error) {
    console.error("❌ getAllPayments error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xử lý VNPAY redirect về (returnUrl)
export const vnpayReturn = async (req, res) => {
  try {
    console.log("📥 VNPAY Return - Raw query:", req.query);

    const secretKey = process.env.VNP_HASHSECRET;

    if (!secretKey) {
      return res.json({
        status: "failed",
        message: "Thiếu cấu hình VNP_HASHSECRET",
      });
    }

    let vnpParams = { ...req.query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    vnpParams = sortObject(vnpParams);

    const signData = querystring.stringify(vnpParams, { encode: false });

    const hmac = crypto.createHmac("sha512", secretKey);
    const expectedSecureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    console.log("🔐 VNPAY VERIFY:", {
      receivedSecureHash: secureHash,
      expectedSecureHash,
      match: secureHash === expectedSecureHash,
    });

    if (secureHash !== expectedSecureHash) {
      console.error("❌ Sai chữ ký!");
      return res.json({
        status: "failed",
        message: "Sai chữ ký (checksum failed)",
        code: "97",
      });
    }

    const txnRef = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;
    const isSuccess = responseCode === "00";

    console.log("💳 Transaction info:", {
      txnRef,
      responseCode,
      isSuccess,
    });

    // Tìm payment trước
    const existingPayment = await Payment.findOne({ txnRef });
    console.log("🔍 Find payment with txnRef:", txnRef, existingPayment ? "FOUND" : "NOT FOUND");

    if (!existingPayment) {
      console.error("❌ Không tìm thấy payment với txnRef:", txnRef);
      
      // List tất cả payments để debug
      const allPayments = await Payment.find().select('txnRef paymentId');
      console.log("📋 All payments in DB:", allPayments);
      
      return res.json({
        status: "failed",
        message: "Không tìm thấy giao dịch tương ứng",
        debug: {
          txnRef,
          allTxnRefs: allPayments.map(p => p.txnRef)
        }
      });
    }

    // Cập nhật payment
    const payment = await Payment.findOneAndUpdate(
      { txnRef },
      {
        status: isSuccess ? "success" : "failed",
        vnp_ResponseCode: responseCode,
        vnp_TransactionNo: vnpParams.vnp_TransactionNo,
        vnp_BankCode: vnpParams.vnp_BankCode,
        vnp_PayDate: vnpParams.vnp_PayDate,
      },
      { new: true }
    );

    console.log("✅ Payment updated:", {
      _id: payment._id,
      status: payment.status,
      vnp_ResponseCode: payment.vnp_ResponseCode
    });

    return res.json({
      status: isSuccess ? "success" : "failed",
      message: isSuccess
        ? "Thanh toán VNPAY thành công"
        : "Thanh toán VNPAY không thành công",
      paymentId: payment.paymentId,
      sessionId: payment.sessionId,
      amount: payment.amount,
      code: responseCode,
    });
  } catch (error) {
    console.error("❌ vnpayReturn error:", error);
    console.error("Stack:", error.stack);
    res.json({ status: "failed", message: error.message });
  }
};
// 3. Lấy thông tin payment theo ID
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ error: "Không tìm thấy payment" });
    }

    return res.json({
      paymentId: payment.paymentId,
      sessionId: payment.sessionId,
      userId: payment.userId,
      stationId: payment.stationId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      txnRef: payment.txnRef,
      vnp_ResponseCode: payment.vnp_ResponseCode,
      vnp_BankCode: payment.vnp_BankCode,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    });
  } catch (error) {
    console.error("❌ getPaymentById error:", error);
    res.status(500).json({ error: error.message });
  }
};
// 4. Lấy payments theo sessionId
export const getPaymentsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const payments = await Payment.find({ sessionId }).sort({ createdAt: -1 });

    return res.json({
      sessionId,
      total: payments.length,
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        amount: p.amount,
        method: p.method,
        status: p.status,
        txnRef: p.txnRef,
        createdAt: p.createdAt,
      }))
    });
  } catch (error) {
    console.error("❌ getPaymentsBySession error:", error);
    res.status(500).json({ error: error.message });
  }
};
// 5. Lấy payments theo userId
export const getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, method, limit = 20, page = 1 } = req.query;

    let query = { userId };
    if (status) query.status = status;
    if (method) query.method = method;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    return res.json({
      userId,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        sessionId: p.sessionId,
        stationId: p.stationId,
        amount: p.amount,
        method: p.method,
        status: p.status,
        createdAt: p.createdAt,
      }))
    });
  } catch (error) {
    console.error("❌ getPaymentsByUser error:", error);
    res.status(500).json({ error: error.message });
  }
};
// 6. Lấy payments theo stationId
export const getPaymentsByStation = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { status, startDate, endDate, limit = 20, page = 1 } = req.query;

    let query = { stationId };
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Tính tổng doanh thu
    const totalRevenue = await Payment.aggregate([
      { $match: { stationId, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    return res.json({
      stationId,
      total,
      totalRevenue: totalRevenue[0]?.total || 0,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        sessionId: p.sessionId,
        userId: p.userId,
        amount: p.amount,
        method: p.method,
        status: p.status,
        createdAt: p.createdAt,
      }))
    });
  } catch (error) {
    console.error("❌ getPaymentsByStation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 7. Thống kê payments
export const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate, stationId, userId } = req.query;

    let matchQuery = {};
    if (stationId) matchQuery.stationId = stationId;
    if (userId) matchQuery.userId = userId;
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    // Tổng số giao dịch theo status
    const statusStats = await Payment.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    // Tổng số giao dịch theo method
    const methodStats = await Payment.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$method", count: { $sum: 1 }, total: { $sum: "$amount" } } }
    ]);

    // Tổng doanh thu
    const totalRevenue = await Payment.aggregate([
      { $match: { ...matchQuery, status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Tổng số giao dịch
    const totalTransactions = await Payment.countDocuments(matchQuery);

    return res.json({
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      byStatus: statusStats.map(s => ({
        status: s._id,
        count: s.count,
        total: s.total
      })),
      byMethod: methodStats.map(m => ({
        method: m._id,
        count: m.count,
        total: m.total
      }))
    });
  } catch (error) {
    console.error("❌ getPaymentStats error:", error);
    res.status(500).json({ error: error.message });
  }
};
// 8. Kiểm tra trạng thái payment
export const checkPaymentStatus = async (req, res) => {
  try {
    const { txnRef } = req.params;

    const payment = await Payment.findOne({ txnRef });

    if (!payment) {
      return res.status(404).json({ error: "Không tìm thấy payment" });
    }

    return res.json({
      txnRef: payment.txnRef,
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
      vnp_ResponseCode: payment.vnp_ResponseCode,
    });
  } catch (error) {
    console.error("❌ checkPaymentStatus error:", error);
    res.status(500).json({ error: error.message });
  }
};

//Hủy payment (chỉ được hủy khi pending)
export const cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ error: "Không tìm thấy payment" });
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ error: "Chỉ có thể hủy payment đang pending" });
    }

    payment.status = "failed";
    payment.vnp_ResponseCode = "24"; // Khách hàng hủy giao dịch
    await payment.save();

    return res.json({
      message: "Đã hủy payment thành công",
      paymentId: payment.paymentId,
      status: payment.status
    });
  } catch (error) {
    console.error("❌ cancelPayment error:", error);
    res.status(500).json({ error: error.message });
  }
};