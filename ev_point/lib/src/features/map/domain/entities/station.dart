// lib/src/features/map/domain/entities/station.dart
class Station {
  final String id;
  final String name;
  final String address;
  final double longitude;
  final double latitude;
  final String connectorType;
  final int powerKw;
  final int totalPoints;
  final int availablePoints;
  final int pricePerKwh;
  final String status;

  bool get available => status.toLowerCase() == 'online' && availablePoints > 0;

  Station({
    required this.id,
    required this.name,
    required this.address,
    required this.longitude,
    required this.latitude,
    required this.connectorType,
    required this.powerKw,
    required this.totalPoints,
    required this.availablePoints,
    required this.pricePerKwh,
    required this.status,
  });
}
