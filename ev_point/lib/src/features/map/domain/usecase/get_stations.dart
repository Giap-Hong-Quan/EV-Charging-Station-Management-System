import '../entities/station.dart';
import '../repositories/station_repository.dart';

class GetStations {
  final StationRepository repo;
  GetStations(this.repo);
  Future<List<Station>> call() => repo.getStations();
}
