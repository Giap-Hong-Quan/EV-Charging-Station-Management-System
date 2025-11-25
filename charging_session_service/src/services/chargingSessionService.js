// src/services/chargingSessionService.js
import crypto from "crypto";
import ChargingSession from "../models/chargingSession.js";
import { ChargingSessionStatus,PaymentMethod,PaymentStatus} from "../utils/constant.js";

const generateSessionCode = () => {
  return "SS" + crypto.randomBytes(4).toString("hex").toUpperCase();
};

export const ChargingSessionService = {
  /**
   * Tạo phiên sạc từ booking hoặc từ staff
   */
  async createSession(req, res) {
    try {
      const {
        booking_code,
        station_id,
        point_id,
        user_id,
        vehicle_name,
        vehicle_number,
        start_soc_percent,
        staff_operation,
      } = req.body;

      // Validate input
      if (!station_id || !point_id || !vehicle_name || !vehicle_number) {
        return res.status(400).json({
          success: false,
          message: "Thiếu dữ liệu bắt buộc",
        });
      }

      const newSession = new ChargingSession({
        booking_code: booking_code || null,
        session_code: generateSessionCode(),
        station_id,
        point_id,
        user_id: user_id || null,
        vehicle_name,
        vehicle_number,
        start_time: new Date(),
        start_soc_percent: start_soc_percent ?? null,
        status: ChargingSessionStatus.IN_PROGRESS,
        staff_operation: staff_operation || null,
        total_kwh: 0,
        total_price: 0,
        payment_method: null,
      });

      const saved = await newSession.save();

      return res.status(201).json({
        success: true,
        data: saved,
      });
    } catch (error) {
      console.error("Error createSession:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo phiên sạc",
      });
    }
  },


   // ============= 2. Tạo thủ công bởi staff =============
  async createManual(req, res) {
    try {
      const {
        station_id,
        point_id,
        vehicle_name,
        vehicle_number,
        user_id,
        start_soc_percent,
        staff_operation,
      } = req.body;

      if (!station_id || !point_id || !vehicle_name || !vehicle_number) {
        return res.status(400).json({
          success: false,
          message: "Thiếu dữ liệu bắt buộc",
        });
      }

      const now = new Date();

      const newSession = new ChargingSession({
        booking_code: null,
        session_code: generateSessionCode(),
        station_id,
        point_id,
        user_id: user_id || null,
        vehicle_name,
        vehicle_number,
        start_time: now,
        start_soc_percent: start_soc_percent ?? null,
        status: ChargingSessionStatus.IN_PROGRESS,
        staff_operation: staff_operation || null,
      });

      const saved = await newSession.save();

      return res.status(201).json({
        success: true,
        data: saved,
      });
    } catch (error) {
      console.error("Error createManual:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo phiên sạc thủ công",
      });
    }
  },
// ============= 3. Lấy chi tiết session ============
  async getById(req, res) {
    try {
      const { id } = req.params;
      const session = await ChargingSession.findById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiên sạc",
        });
      }

      return res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error("Error getById:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy phiên sạc",
      });
    }
  },

  // ============= 4. List theo station ============
  async getByStation(req, res) {
    try {
      const { station_id } = req.params;
      const { status } = req.query; // optional: filter status

      const filter = { station_id };
      if (status) filter.status = status;

      const sessions = await ChargingSession.find(filter).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      console.error("Error getByStation:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách session theo trạm",
      });
    }
  },
//get all
  async getAll(req, res) {
    try {
      const { status } = req.query;
      const filter = {};
      if (status) filter.status = status;

      const sessions = await ChargingSession.find(filter).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      console.error("Error getAll:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách session",
      });
    }
  },
  //list theo user 
  async getByUser(req, res) {
    try {
      const { user_id } = req.params;

      const sessions = await ChargingSession.find({ user_id }).sort({
        createdAt: -1,
      });

      return res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      console.error("Error getByUser:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách session theo user",
      });
    }
  },

  // ============= 6. Kết thúc session (khi dừng sạc) ============
  async endSession(req, res) {
    try {
      const { id } = req.params;
      const {
        end_time,
        end_soc_percent,
        total_kwh,
        total_price,
      } = req.body;

      const session = await ChargingSession.findById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiên sạc",
        });
      }

      if (session.status !== ChargingSessionStatus.IN_PROGRESS) {
        return res.status(400).json({
          success: false,
          message: "Chỉ có thể kết thúc phiên đang IN_PROGRESS",
        });
      }

      const endTime = end_time ? new Date(end_time) : new Date();
      const startTime = new Date(session.start_time);
      const durationMinutes = Math.max(
        0,
        Math.round((endTime - startTime) / 60000)
      );

      session.end_time = endTime;
      session.duration_time = durationMinutes;
      session.end_soc_percent = end_soc_percent ?? session.end_soc_percent;
      session.total_kwh = total_kwh ?? session.total_kwh;
      session.total_price = total_price ?? session.total_price;
      session.status = ChargingSessionStatus.WAITING_PAYMENT;

      await session.save();

      return res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error("Error endSession:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi kết thúc phiên sạc",
      });
    }
  },

  // ============= 7. Cập nhật trạng thái thanh toán ============
  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const { payment_method, payment_status, transaction_id } = req.body;

      const session = await ChargingSession.findById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy phiên sạc",
        });
      }

      // chặn update payment nếu chưa ở WAITING_PAYMENT
      if (
        session.status !== ChargingSessionStatus.WAITING_PAYMENT &&
        session.status !== ChargingSessionStatus.IN_PROGRESS
      ) {
        return res.status(400).json({
          success: false,
          message: "Phiên sạc không ở trạng thái chờ thanh toán",
        });
      }

      if (payment_method && !Object.values(PaymentMethod).includes(payment_method)) {
        return res.status(400).json({
          success: false,
          message: "payment_method không hợp lệ",
        });
      }

      if (
        payment_status &&
        !Object.values(PaymentStatus).includes(payment_status)
      ) {
        return res.status(400).json({
          success: false,
          message: "payment_status không hợp lệ",
        });
      }

      session.payment_method = payment_method || session.payment_method;
      session.payment_status = payment_status || session.payment_status;
      session.transaction_id = transaction_id || session.transaction_id;

      if (payment_status === PaymentStatus.PAID) {
        session.status = ChargingSessionStatus.COMPLETED;
      } else if (payment_status === PaymentStatus.FAILED) {
        session.status = ChargingSessionStatus.WAITING_PAYMENT;
      }

      await session.save();

      return res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error("Error updatePayment:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật thanh toán",
      });
    }
  },

};
