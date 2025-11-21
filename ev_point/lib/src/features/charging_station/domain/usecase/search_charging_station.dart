import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/domain/repositories/charging_station_repository.dart';

class SearchChargingStation {
  final IChargingStationRepository repo;
  SearchChargingStation(this.repo);
  Future<List<ChargingStation>> call(String keyword, String connectorType) => repo.searchChargingStation(keyword,connectorType);
}
