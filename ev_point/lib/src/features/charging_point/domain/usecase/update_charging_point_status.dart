import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';

class UpdateChargingPointStatus {
  final IChargingPointRepository chargingPointRepository;

  UpdateChargingPointStatus(this.chargingPointRepository);

  Future<ChargingPoint> call(
      {required String chargingPointId, required String status}) {
    return chargingPointRepository.updateChargingPointStatus(
        chargingPointId, status);
  }
}