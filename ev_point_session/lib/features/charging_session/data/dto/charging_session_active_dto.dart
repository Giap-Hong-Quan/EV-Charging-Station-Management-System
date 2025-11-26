class ChargingSessionActiveDto {
  final String sessionId;
  final String userId;
  final String stationId;
  final int powerKWh;
  final int pricePerKWh;
  final int startTimeCharging;
  final String? stationName;
  final int? pointNumber;
  final DateTime startTime;

  ChargingSessionActiveDto({
    required this.sessionId,
    required this.userId,
    required this.stationId,
    required this.powerKWh,
    required this.pricePerKWh,
    required this.startTimeCharging,
    this.stationName,
    this.pointNumber,
    required this.startTime,
  });
}