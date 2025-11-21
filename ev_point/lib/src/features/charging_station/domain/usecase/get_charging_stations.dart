import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/domain/repositories/charging_station_repository.dart';

class GetChargingStations {
  final IChargingStationRepository repo;
  GetChargingStations(this.repo);
  Future<List<ChargingStation>> call() => repo.getChargingStations();
}
