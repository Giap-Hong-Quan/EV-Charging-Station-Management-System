// lib/src/features/map/data/models/station_model.dart
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';


class ChargingStationsModel extends ChargingStation {
  ChargingStationsModel({
    required super.id,
    required super.name,
    required super.address,
    required super.longitude,
    required super.latitude,
    required super.connectorType,
    required super.powerKw,
    required super.totalPoints,
    required super.availablePoints,
    required super.pricePerKwh,
    required super.status,
  });

  factory ChargingStationsModel.fromJson(Map<String, dynamic> j) {
    return ChargingStationsModel(
      id: j['_id'].toString(),
      name: j['name'] ?? '',
      address: j['address'] ?? '',
      longitude: (j['latitude'] as num).toDouble(),
      latitude: (j['longitude'] as num).toDouble(),
      connectorType: j['connector_type'] ?? '',
      powerKw: (j['power_rating'] as num?)?.toInt() ?? 0,
      totalPoints: (j['total_points'] as num?)?.toInt() ?? 0,
      availablePoints: (j['available_points'] as num?)?.toInt() ?? 0,
      pricePerKwh: (j['price_per_kwh'] as num?)?.toInt() ?? 0,
      status: j['status'] ?? 'offline',
    );
  }
}
