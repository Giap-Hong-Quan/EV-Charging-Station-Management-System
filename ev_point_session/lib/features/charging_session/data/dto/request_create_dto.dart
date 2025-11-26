class RequestCreateChargingSessionDto {
  final String bookingCode;
  final String userId;
  final String stationId;
  final String chargingPointId;
  final String vehicleName;
  final String vehicleNumber;
  final int startSocPercent;
  RequestCreateChargingSessionDto({
    required this.bookingCode,
    required this.userId,
    required this.stationId,
    required this.chargingPointId,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.startSocPercent,
  });

  toJson() {
    return {
      'booking_code': bookingCode,
      'station_id': stationId,
      'point_id': chargingPointId,
      'user_id': userId,
      'vehicle_name': vehicleName,
      'vehicle_number': vehicleNumber,
      'start_soc_percent': startSocPercent,
    };
  }
}
