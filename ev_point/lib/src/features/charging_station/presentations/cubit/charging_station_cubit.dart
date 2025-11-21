import 'package:ev_point/src/features/charging_station/domain/usecase/get_charging_station_by_id.dart';
import 'package:ev_point/src/features/charging_station/domain/usecase/get_charging_stations.dart';
import 'package:ev_point/src/features/charging_station/domain/usecase/search_charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChargingStationCubit extends Cubit<ChargingStationState> {
  final GetChargingStationById getChargingStationByIdUC;
  final GetChargingStations getChargingStationsUC;
  final SearchChargingStation searchChargingStationUC;
  ChargingStationCubit({
    required this.getChargingStationByIdUC,
    required this.getChargingStationsUC,
    required this.searchChargingStationUC,
  }) : super(ChargingStationInitial());
  Future<void> loadChargingStations() async {
    emit(ChargingStationLoading());
    try {
      final list = await getChargingStationsUC();
      emit(ChargingStationLoaded(list));
    } catch (e) {
      emit(ChargingStationError(e.toString()));
    }
  }

  Future<void> searchChargingStation(String keyword, String connectorType) async {
    emit(ChargingStationLoading());
    try {
      if (keyword.isEmpty && connectorType.isEmpty) {
        final fullList = await getChargingStationsUC();
        emit(ChargingStationLoaded(fullList));
      } else {
        final searchList = await searchChargingStationUC(keyword, connectorType);
        emit(ChargingStationLoaded(searchList));
      }
    } catch (e) {
      emit(ChargingStationError(e.toString()));
    }
  }

  Future<void> getChargingStationById(String id) async {
    emit(ChargingStationLoading());
    try {
      final station = await getChargingStationByIdUC(id);
      emit(ChargingStationCreated(station));
    } catch (e) {
      emit(ChargingStationError(e.toString()));
    }
  }
}
