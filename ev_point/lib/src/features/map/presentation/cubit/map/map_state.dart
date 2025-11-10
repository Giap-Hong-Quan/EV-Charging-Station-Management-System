import '../../../domain/entities/station.dart';
import 'package:geolocator/geolocator.dart' as geo;

sealed class MapState {
  const MapState();
}

class MapInitial extends MapState {
  const MapInitial();
}

class MapLoading extends MapState {
  const MapLoading();
}

class MapLoaded extends MapState {
  final geo.Position userPos;
  final List<Station> stations;
  const MapLoaded(this.userPos, this.stations);
}

class MapError extends MapState {
  final String message;
  const MapError(this.message);
}
