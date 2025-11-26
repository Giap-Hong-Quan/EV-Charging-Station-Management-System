import 'package:ev_point_session/features/charging_session/data/datasources/charging_session_remote_datasource.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/data/models/charging_session_model.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/icharging_session_repository.dart';

class ChargingSessionRepositoryImpl implements IchargingSessionRepository {
  final IchargingSessionRemoteDatasource remoteDatasource;
  ChargingSessionRepositoryImpl(this.remoteDatasource);

  @override
  Future<ChargingSessionModel> createChargingSession(
      RequestCreateChargingSessionDto requestDto) {
    return remoteDatasource.createChargingSession(requestDto);
  }

  @override
  Future<ChargingSession> endChargingSession(RequestEndChargingSessionDto requestDto) {
    return remoteDatasource.endChargingSession(requestDto);
  }
}