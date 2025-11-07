import 'package:ev_point/src/features/booking/domain/entities/booking.dart';

class BookingModel extends Booking {
  BookingModel({
    required super.id,
    required super.userId,
    required super.stationId,
    required super.pointId,
    required super.scheduleStartTime,
    required super.scheduleEndTime,
    super.holdExpireAt,
    required super.status,
    super.cancelledAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'],
      userId: json['user_id'],  
      stationId: json['station_id'],
      pointId: json['point_id'],
      scheduleStartTime: DateTime.parse(json['schedule_start_time']),
      scheduleEndTime: DateTime.parse(json['schedule_end_time']),
      holdExpireAt: json['hold_expires_at'],
      status: json['status'],
      cancelledAt: json['cancelled_at'] != null 
          ? DateTime.parse(json['cancelled_at']) 
          : null,  
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,  
      'station_id': stationId,
      'point_id': pointId,
      'schedule_start_time': scheduleStartTime.toIso8601String(),
      'schedule_end_time': scheduleEndTime.toIso8601String(),
      'hold_expires_at': holdExpireAt,
      'status': status,
      'cancelled_at': cancelledAt?.toIso8601String(),  
    };
  }
}