// src/utils/vnpay.js
import crypto from "crypto";
import moment from "moment";
import querystring from "qs";

/**
 * Sort object theo key A–Z và encode giá trị (chuẩn VNPAY)
 */
export function sortObject(obj) {
  let sorted = {};
  let str = [];
  
  // Fix: Dùng Object.prototype.hasOwnProperty.call()
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  
  str.sort();
  
  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(obj[str[i]]).replace(/%20/g, "+");
  }
  
  return sorted;
}

/**
 * Tạo URL thanh toán VNPAY
 * @param {string} sessionId  - ID phiên sạc
 * @param {number} amount     - số tiền VNĐ (chưa nhân 100)
 * @param {string} ipAddr     - IP client
 * @returns {{ paymentUrl: string, txnRef: string }}
 */
export const generateVNPayUrl = (sessionId, amount, ipAddr) => {
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURNURL;

  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
    throw new Error("Thiếu cấu hình VNPAY (.env)");
  }

  // Tạo mã giao dịch vnp_TxnRef (giống code mẫu VNPAY)
  const date = new Date();
  const txnRef = moment(date).format("DDHHmmss");

  // Fix IP
  if (!ipAddr || ipAddr.includes("::")) {
    ipAddr = "127.0.0.1";
  }

  const createDate = moment(date).format("YYYYMMDDHHmmss");

  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Thanh toan cho ma GD:${txnRef}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Sort và encode theo chuẩn VNPAY
  vnpParams = sortObject(vnpParams);

  // Tạo signData (KHÔNG encode thêm lần nữa)
  const signData = querystring.stringify(vnpParams, { encode: false });

  // Tạo secure hash
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnpParams["vnp_SecureHash"] = secureHash;

  // Build URL redirect
  const paymentUrl = vnpUrl + "?" + querystring.stringify(vnpParams, { encode: false });

  return { paymentUrl, txnRef };
};