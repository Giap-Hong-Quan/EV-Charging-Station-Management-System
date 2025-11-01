import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/mysql.js';
import { BOOKING_STATUS_LIST, BOOKING_STATUS } from '../constants/booking.constant.js';

class Booking extends Model {}

Booking.init(
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isInt: true, min: 1 },
    },
    station_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isInt: true, min: 1 },
    },
    point_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isInt: true, min: 1 },
    },

    schedule_start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterNow(value) {
          if (!(value instanceof Date)) return;
          if (new Date(value).getTime() <= Date.now()) {
            throw new Error('schedule_start_time must be in the future');
          }
        },
      },
    },

    schedule_end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStart(value) {
          if (!(value instanceof Date)) return;
          if (new Date(value) <= new Date(this.schedule_start_time)) {
            throw new Error('schedule_end_time must be after schedule_start_time');
          }
        },
      },
    },

    // TTL giữ chỗ (nếu dùng luồng HELD → CONFIRMED)
    hold_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { isDate: true },
    },

    status: {
      // Trạng thái booking (chuẩn hóa theo flow microservice)
      type: DataTypes.ENUM(...BOOKING_STATUS_LIST),
      allowNull: false,
      defaultValue: BOOKING_STATUS.COMPLETE,
    },

    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isAfterStartIfSet(value) {
          if (value && new Date(value) <= new Date(this.schedule_start_time)) {
            throw new Error('cancelled_at must be after schedule_start_time');
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    underscored: true, // dùng user_id, created_at, updated_at thay vì camelCase
    timestamps: true,  // tự tạo created_at, updated_at
    indexes: [
      { fields: ['user_id'] },
      { fields: ['station_id'] },
      { fields: ['point_id'] },
      { fields: ['status'] },
      { fields: ['schedule_start_time'] },
      { fields: ['schedule_end_time'] },
      // Composite index hỗ trợ query theo điểm sạc + thời gian
      { fields: ['point_id', 'status', 'schedule_start_time', 'schedule_end_time'] },
    ],
    hooks: {
      beforeValidate(instance) {
        // Nếu không có end time → mặc định 30 phút sau start
        if (!instance.schedule_end_time && instance.schedule_start_time) {
          const end = new Date(instance.schedule_start_time);
          end.setMinutes(end.getMinutes() + 30);
          instance.schedule_end_time = end;
        }
      },
    },
  }
);

await sequelize.sync({ alter: true }); 

export default Booking;
