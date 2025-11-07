import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';

abstract class IChargingPointRepository{
  Future<List<ChargingPoint>> getAllChargingPoint();
  Future<List<ChargingPoint>> getChargingPointByStationId(String stationId);
  Future<ChargingPoint> getChargingPointById(String chargingPointId);
}