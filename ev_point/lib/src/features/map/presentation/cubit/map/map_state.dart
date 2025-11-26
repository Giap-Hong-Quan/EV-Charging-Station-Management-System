import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';

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
  final List<ChargingStation> stations;
  const MapLoaded(this.userPos, this.stations);
}

class MapError extends MapState {
  final String message;
  const MapError(this.message);
}
