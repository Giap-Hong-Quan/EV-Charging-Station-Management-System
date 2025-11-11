import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';

class BookingModel extends Booking {
  BookingModel({
    required super.id,
    required super.bookingCode,
    required super.userId,
    required super.stationId,
    required super.pointId,
    required super.vehicleName,
    required super.vehicleNumber,
    required super.scheduleStartTime,
    required super.scheduleEndTime,
    super.holdExpireAt,
    required super.status,
    super.cancelledAt,
  });

  
  factory BookingModel.fromJson(Map<String, dynamic> json) {
    int parseId(dynamic value) {
        if (value == null) return 0;
        if (value is int) return value;
        if (value is String) return int.tryParse(value) ?? 0;
        return 0;
      }
      DateTime? parseDateTime(dynamic value) {
        if (value == null || value.toString().isEmpty) return null;
        try {
          return DateTime.parse(value.toString());
        } catch (e) {
          return null;
        }
      }
    return BookingModel(
      id: parseId(json['id']),
        bookingCode: json['booking_code']?.toString() ?? '',
        userId: json['user_id']?.toString() ?? '',
        stationId: json['station_id']?.toString() ?? '',
        pointId: json['point_id']?.toString() ?? '',
        vehicleName: json['vehicle_name']?.toString() ?? '',
        vehicleNumber: json['vehicle_number']?.toString() ?? '',
        scheduleStartTime: parseDateTime(json['schedule_start_time']),
        scheduleEndTime: parseDateTime(json['schedule_end_time']),
        holdExpireAt: json['hold_expires_at']?.toString(),
        status: json['status']?.toString() ?? '',
        cancelledAt: parseDateTime(json['cancelled_at']),
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_code': bookingCode,
      'user_id': userId,
      'station_id': stationId,
      'point_id': pointId,
      'vehicle_name': vehicleName,
      'vehicle_number': vehicleNumber,
      'schedule_start_time': scheduleStartTime?.toIso8601String(),
      'schedule_end_time': scheduleEndTime?.toIso8601String(),
      'hold_expires_at': holdExpireAt,
      'status': status,
      'cancelled_at': cancelledAt?.toIso8601String(),
    };
  }
}