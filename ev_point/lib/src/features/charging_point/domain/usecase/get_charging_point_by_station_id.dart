import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';

class GetChargingPointByStationId{
  final IChargingPointRepository chargingPointRepository;
  GetChargingPointByStationId(this.chargingPointRepository);
  Future<List<ChargingPoint>> call(String stationId) => chargingPointRepository.getChargingPointByStationId(stationId);
}