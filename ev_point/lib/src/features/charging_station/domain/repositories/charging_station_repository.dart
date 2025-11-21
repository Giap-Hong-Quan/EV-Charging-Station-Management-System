import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';

abstract class IChargingStationRepository {
  Future<List<ChargingStation>> getChargingStations();
  Future<ChargingStation> geChargingStationById(String stationId);
  Future<List<ChargingStation>> searchChargingStation(String keyword,String connectorType);
}