import 'package:equatable/equatable.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';

abstract class ChargingSessionState extends Equatable {
  const ChargingSessionState();

  @override
  List<Object?> get props => [];
}

class ChargingSessionInitial extends ChargingSessionState {}

class ChargingSessionLoading extends ChargingSessionState {}

class ChargingSessionCreated extends ChargingSessionState {
  final ChargingSession chargingSession;

  const ChargingSessionCreated(this.chargingSession);

  @override
  List<Object?> get props => [chargingSession];
}

class ChargingSessionsLoaded extends ChargingSessionState {
  final List<ChargingSession> chargingSessions;

  const ChargingSessionsLoaded(this.chargingSessions);

  @override
  List<Object?> get props => [chargingSessions];
}

class ChargingSessionError extends ChargingSessionState {
  final String message;

  const ChargingSessionError(this.message);

  @override
  List<Object?> get props => [message];
}

class ChargingSessionChecked extends ChargingSessionState {
  final Booking booking;

  const ChargingSessionChecked(this.booking);

  @override
  List<Object?> get props => [booking];
}