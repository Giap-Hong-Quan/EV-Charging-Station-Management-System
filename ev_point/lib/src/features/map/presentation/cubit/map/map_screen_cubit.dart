import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../domain/usecase/get_stations.dart';
import '../../../domain/usecase/get_user_location.dart';
import 'map_state.dart';


class MapCubit extends Cubit<MapState> {
  final GetStations getStations;
  final GetUserLocation getUserLocation;

  MapCubit({required this.getStations, required this.getUserLocation})
      : super(const MapInitial());

  Future<void> load() async {
    emit(const MapLoading());
    try {
      final pos = await getUserLocation();
      final stations = await getStations();
      emit(MapLoaded(pos, stations));
    } catch (e) {
      emit(MapError(e.toString()));
    }
  }
}
