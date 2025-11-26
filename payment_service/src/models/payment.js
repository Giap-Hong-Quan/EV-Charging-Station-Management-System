// src/models/payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    stationId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["COD", "VNPAY"], required: true },

    // VNPAY fields
    txnRef: { type: String, sparse: true, unique: true }, // sparse cho phép null
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    vnp_ResponseCode: { type: String },
    vnp_TransactionNo: { type: String },
    vnp_PayDate: { type: String },
    vnp_BankCode: { type: String },
  },
  { 
    timestamps: true,
    collection: 'payments' // Đảm bảo tên collection đúng
  }
);

// Index để tìm kiếm nhanh
PaymentSchema.index({ txnRef: 1 });
PaymentSchema.index({ sessionId: 1 });
PaymentSchema.index({ userId: 1 });

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;