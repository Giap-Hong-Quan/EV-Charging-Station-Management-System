// src/utils/validator.js
import Joi from "joi";

export const createBookingSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  point_id: Joi.number().integer().positive().required(),
  schedule_start_time: Joi.date().iso().greater("now").required(),
  schedule_end_time: Joi.date().iso().greater(Joi.ref("schedule_start_time")).required(),
  // giữ chỗ theo TTL (tuỳ chọn)
  hold_minutes: Joi.number().integer().min(5).max(180).default(30)
});
