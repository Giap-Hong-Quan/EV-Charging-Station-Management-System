import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/domain/repositories/charging_station_repository.dart';


class GetChargingStationById {
  final IChargingStationRepository repo;
  GetChargingStationById(this.repo);
  Future<ChargingStation> call(String stationId) => repo.geChargingStationById(stationId);
}
