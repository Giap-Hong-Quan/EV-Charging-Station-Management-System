import '../../domain/entities/charging_point.dart';

class ChargingPointModel extends ChargingPoint {
  ChargingPointModel({
    required super.id,
    required super.stationId,
    required super.pointNumber,
    required super.pointStatus,
  });

  factory ChargingPointModel.fromJson(Map<String, dynamic> json) {
    return ChargingPointModel(
      id: json['_id'] ?? '',
      stationId: json['station_id'] ?? '',
      pointNumber: json['point_number'] ?? 0,
      pointStatus: json['point_status'] ?? 'available',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'station_id': stationId,
      'point_number': pointNumber,
      'point_status': pointStatus,
    };
  }
}
