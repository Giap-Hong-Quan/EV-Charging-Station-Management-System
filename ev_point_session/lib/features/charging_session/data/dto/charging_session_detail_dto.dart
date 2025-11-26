import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';

class ChargingSessionDetailDto {
  final ChargingSession chargingSession;
  final String userId;
  final String stationId;
  final int startSocPercent;
  final int endSocPercent;
  final String stationName;
  final int pointNumber;
  final int durationMinutes;
  final int powerDelivered;
  final DateTime startTime;
  final DateTime? endTime;
  ChargingSessionDetailDto({
    required this.chargingSession,
    required this.userId,
    required this.stationId,
    required this.startSocPercent,
    required this.endSocPercent,
    required this.stationName,
    required this.pointNumber,
    required this.durationMinutes,
    required this.powerDelivered,
    required this.startTime,
    this.endTime,
  });

  Map<String, dynamic> toJson() {
    return {
      'chargingSession': chargingSession,
      'startSocPercent': startSocPercent,
      'endSocPercent': endSocPercent,
      'stationName': stationName,
      'pointNumber': pointNumber,
      'durationMinutes': durationMinutes,
      'powerDelivered': powerDelivered,
    };
  }

}