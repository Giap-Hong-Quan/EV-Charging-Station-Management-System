import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/icharging_session_repository.dart';

class EndChargingSessionUseCase {
  final IchargingSessionRepository repository;
  EndChargingSessionUseCase(this.repository);
  Future<ChargingSession> call(
      RequestEndChargingSessionDto requestDto) {
    return repository.endChargingSession(requestDto);
  }
}