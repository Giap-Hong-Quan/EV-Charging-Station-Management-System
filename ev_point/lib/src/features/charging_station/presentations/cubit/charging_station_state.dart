
import 'package:equatable/equatable.dart';
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';

abstract class ChargingStationState extends Equatable {
  const ChargingStationState();

  @override
  List<Object?> get props => [];
}

class ChargingStationInitial extends ChargingStationState {}

class ChargingStationLoading extends ChargingStationState {}

class ChargingStationCreated extends ChargingStationState {
  final ChargingStation chargingStation;

  const ChargingStationCreated(this.chargingStation);

  @override
  List<Object?> get props => [chargingStation];
}

class ChargingStationLoaded extends ChargingStationState {
  final List<ChargingStation> chargingStations;
  const ChargingStationLoaded(this.chargingStations);

  @override
  List<Object?> get props => [chargingStations];
}

class ChargingStationError extends ChargingStationState {
  final String message;

  const ChargingStationError(this.message);

  @override
  List<Object?> get props => [message];
}