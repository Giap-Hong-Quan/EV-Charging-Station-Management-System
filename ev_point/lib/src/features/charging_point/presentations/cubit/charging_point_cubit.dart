import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_station_id.dart';
import 'charging_point_state.dart';

class ChargingPointCubit extends Cubit<ChargingPointState> {
  final GetChargingPointByStationId getChargingPointByStationId;
  final GetChargingPoint getChargingPoint;

  ChargingPointCubit({
    required this.getChargingPointByStationId,
    required this.getChargingPoint,
  }) : super(ChargingPointInitial());

  Future<List<ChargingPoint>> loadAllChargingPoint() async {
    emit(ChargingPointLoading());
    try {
      final List<ChargingPoint> result = await getChargingPoint();
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
      final List<ChargingPoint> result = await getChargingPointByStationId(stationId);
      emit(ChargingPointLoaded(result));
      return result;
    } catch (e) {
      emit(ChargingPointError(e.toString()));
      return const <ChargingPoint>[];
    }
  }
}
