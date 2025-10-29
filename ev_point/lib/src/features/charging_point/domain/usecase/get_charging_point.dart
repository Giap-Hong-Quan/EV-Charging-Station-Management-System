import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';

class GetChargingPoint{
  final IChargingPointRepository chargingPointRepository;
  GetChargingPoint(this.chargingPointRepository);
  Future<List<ChargingPoint>> call() =>
      chargingPointRepository.getAllChargingPoint();
}
