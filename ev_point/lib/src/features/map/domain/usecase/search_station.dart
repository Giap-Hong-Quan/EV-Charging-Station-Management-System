import '../entities/station.dart';
import '../repositories/station_repository.dart';

class SearchStation {
  final StationRepository repo;
  SearchStation(this.repo);
  Future<List<Station>> call(String keyword, String connectorType) => repo.searchStation(keyword,connectorType);
}
