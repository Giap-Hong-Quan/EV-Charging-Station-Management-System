class Booking {
  final int id;
  final String userId;
  final String bookingCode;
  final String stationId;
  final String pointId;
  final String vehicleName;
  final String vehicleNumber;
  final DateTime scheduleStartTime;
  final DateTime scheduleEndTime;
  final String? holdExpireAt; 
  final String status;
  final DateTime? cancelledAt;  
  Booking({
    required this.id,
    required this.userId,
    required this.bookingCode,
    required this.stationId,
    required this.pointId,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.scheduleStartTime,
    required this.scheduleEndTime,
    this.holdExpireAt,
    required this.status,
    this.cancelledAt,
  });
}