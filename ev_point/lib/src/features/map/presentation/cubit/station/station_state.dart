import '../../../domain/entities/station.dart';

class StationState {
  final bool loading;
  final List<Station> stations;
  final String? error;
  StationState({this.loading = false, this.stations = const [], this.error});
}
