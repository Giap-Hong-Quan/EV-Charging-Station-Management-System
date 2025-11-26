import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/icharging_session_repository.dart';

class CreateChargingSessionUC {
  final IchargingSessionRepository repository;
  CreateChargingSessionUC(this.repository);
  Future<ChargingSession> call(
      RequestCreateChargingSessionDto requestDto) {
    return repository.createChargingSession(requestDto);
  }
}