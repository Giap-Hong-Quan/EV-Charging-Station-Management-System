import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_id.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_station_id.dart';
import 'charging_point_state.dart';

class ChargingPointCubit extends Cubit<ChargingPointState> {
  final GetChargingPointByStationId getChargingPointByStationIdUseCase;
  final GetChargingPoint getChargingPointUseCase;
  final GetChargingPointById getChargingPointByIdUseCase;

  ChargingPointCubit({
    required this.getChargingPointByStationIdUseCase,
    required this.getChargingPointUseCase,
    required this.getChargingPointByIdUseCase,
  }) : super(ChargingPointInitial());

  Future<List<ChargingPoint>> loadAllChargingPoint() async {
    emit(ChargingPointLoading());
    try {
      final List<ChargingPoint> result = await getChargingPointUseCase();
      emit(ChargingPointLoaded(result));
      return result;
    } catch (e) {
      emit(ChargingPointError(e.toString()));
      return const <ChargingPoint>[];
    }
  }

  Future<List<ChargingPoint>> loadChargingPointByStationId(String stationId) async {
    emit(ChargingPointLoading());
    try {
      final List<ChargingPoint> result = await getChargingPointByStationIdUseCase(stationId);
      emit(ChargingPointLoaded(result));
      return result;
    } catch (e) {
      emit(ChargingPointError(e.toString()));
      return const <ChargingPoint>[];
    }
  }

  Future<ChargingPoint?> loadChargingPointById(String chargingPointId) async {
    emit(ChargingPointLoading());
    try {
      final ChargingPoint result = await getChargingPointByIdUseCase(chargingPointId);
      emit(ChargingPointLoaded([result]));
      return result;
    } catch (e) {
      emit(ChargingPointError(e.toString()));
      return null;
    }
  }
}
