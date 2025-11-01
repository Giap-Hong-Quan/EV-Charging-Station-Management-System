import 'package:ev_point/src/features/booking/domain/entities/booking.dart';

class BookingModel extends Booking {
  BookingModel({
    required super.id,
    required super.userId,
    required super.stationId,
    required super.pointId,
    required super.scheduleStartTime,
    required super.scheduleEndTime,
    required super.holdExpireAt,
    required super.status,
    required super.cancelledAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'],
      userId: json['userId'],
      stationId: json['stationId'],
      pointId: json['pointId'],
      scheduleStartTime: DateTime.parse(json['scheduleStartTime']),
      scheduleEndTime: DateTime.parse(json['scheduleEndTime']),
      holdExpireAt: json['holdExpireAt'],
      status: json['status'],
      cancelledAt: DateTime.parse(json['cancelledAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'stationId': stationId,
      'pointId': pointId,
      'scheduleStartTime': scheduleStartTime.toIso8601String(),
      'scheduleEndTime': scheduleEndTime.toIso8601String(),
      'holdExpireAt': holdExpireAt,
      'status': status,
      'cancelledAt': cancelledAt.toIso8601String(),
    };
  }
}
