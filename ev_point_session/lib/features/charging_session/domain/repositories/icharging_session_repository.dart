import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';

abstract class IchargingSessionRepository {
  Future<ChargingSession> createChargingSession(
      RequestCreateChargingSessionDto requestDto);

  Future<ChargingSession> endChargingSession(RequestEndChargingSessionDto requestDto);
}