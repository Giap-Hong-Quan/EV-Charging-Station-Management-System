class ChargingPoint {
  final String id;
  final String stationId;
  final int pointNumber;
  final String pointStatus;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  ChargingPoint({
    this.id = '',
    required this.stationId,
    required this.pointNumber,
    this.pointStatus = 'available',
    this.createdAt,
    this.updatedAt,
  });

}
