class Booking {
  final int id;
  final String? userId;
  final String bookingCode;
  final String? stationId;
  final String? pointId;
  final String? vehicleName;
  final String? vehicleNumber;
  final DateTime? scheduleStartTime;
  final DateTime? scheduleEndTime;
  final String? holdExpireAt; 
  final String? status;
  final DateTime? cancelledAt;  
  Booking({
    required this.id,
    this.userId,
    required this.bookingCode,
    this.stationId,
    this.pointId,
    this.vehicleName,
    this.vehicleNumber,
    this.scheduleStartTime,
    this.scheduleEndTime,
    this.holdExpireAt,
    this.status,
    this.cancelledAt,
  });
}