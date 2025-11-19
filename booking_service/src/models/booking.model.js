import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/mysql.js';
import { BOOKING_STATUS_LIST, BOOKING_STATUS } from '../constants/booking.constant.js';

class Booking extends Model { }

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    booking_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    station_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point_id: {
      type: DataTypes.STRING,
      allowNull: false,
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

    hold_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { isDate: true },
    },

    status: {
      type: DataTypes.ENUM(...BOOKING_STATUS_LIST),
      allowNull: false,
      defaultValue: BOOKING_STATUS.UPCOMING,
    },

    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,

    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['point_id', 'status',] },
      { fields: ['booking_code'] ,unique: true},
    ],
    hooks: {
      beforeValidate(instance) {
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