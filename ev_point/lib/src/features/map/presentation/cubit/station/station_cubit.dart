import 'package:ev_point/src/features/map/domain/usecase/search_station.dart';
import 'package:ev_point/src/features/map/presentation/cubit/station/station_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../domain/usecase/get_stations.dart';

class StationCubit extends Cubit<StationState> {
  final GetStations getStationsUC;
  final SearchStation searchStationUC;
  StationCubit(this.getStationsUC, this.searchStationUC)
    : super(StationState(loading: true));

  Future<void> load() async {
    emit(StationState(loading: true));
    try {
      final list = await getStationsUC();
      emit(StationState(loading: false, stations: list));
    } catch (e) {
      emit(StationState(loading: false, error: e.toString()));
    }
  }

  Future<void> search(String keyword, String connectorType) async {
    emit(StationState(loading: true));
    try {
      if (keyword.isEmpty && connectorType.isEmpty) {
        final fullList = await getStationsUC();
        emit(StationState(loading: false, stations: fullList));
      } else {
        final searchList = await searchStationUC(keyword, connectorType);
        emit(StationState(loading: false, stations: searchList));
      }
    } catch (e) {
      emit(StationState(loading: false, error: e.toString()));
    }
  }
}
