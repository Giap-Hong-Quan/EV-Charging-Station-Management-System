import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';

class GetChargingPointById {
  final IChargingPointRepository chargingPointRepository;

  GetChargingPointById(this.chargingPointRepository);

  Future<ChargingPoint> call(String chargingPointId) {
    return chargingPointRepository.getChargingPointById(chargingPointId);
  }
}