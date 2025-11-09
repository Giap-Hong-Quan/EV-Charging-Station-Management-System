class ChargingSession {
  final String id;
  final int bookingId;
  final String sessionCode;
  final String vehicleName;
  final String vehicleNumber;
  final DateTime startTime;
  final DateTime endTime;
  final DateTime? durationTime;
  final String status;
  final String startSoCPercent;
  final String endSoCPercent;
  final double totalKwh;
  final double totalAmount;
  final String paymentMethod;
  final String  staffOperation;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ChargingSession({
    required this.id,
    required this.bookingId,
    required this.sessionCode,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.startTime,
    required this.endTime,
    this.durationTime,
    required this.status,
    required this.startSoCPercent,
    required this.endSoCPercent,
    required this.totalKwh,
    required this.totalAmount,
    required this.paymentMethod,
    required this.staffOperation,
    required this.createdAt,
    this.updatedAt,
  });
}