import '../entities/station.dart';
import '../repositories/station_repository.dart';

class GetStationById {
  final StationRepository repo;
  GetStationById(this.repo);
  Future<Station> call(String stationId) => repo.getStationById(stationId);
}
