class Booking {
  final int id;
  final int userId;
  final int pointId;
  final DateTime scheduleStartTime;
  final DateTime scheduleEndTime;
  final String holdExpireAt;
  final String status;
  final DateTime cancelledAt;

  Booking({
    required this.id,
    required this.userId,
    required this.pointId,
    required this.scheduleStartTime,
    required this.scheduleEndTime,
    required this.holdExpireAt,
    required this.status,
    required this.cancelledAt,
  });
}
