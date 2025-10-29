import 'package:equatable/equatable.dart';

import '../../domain/entities/charging_point.dart';

abstract class ChargingPointState extends Equatable {
  const ChargingPointState();

  @override
  List<Object?> get props => [];
}

class ChargingPointInitial extends ChargingPointState {}

class ChargingPointLoading extends ChargingPointState {}

class ChargingPointLoaded extends ChargingPointState {
  final List<ChargingPoint> chargingPoints;

  const ChargingPointLoaded(this.chargingPoints);

  @override
  List<Object?> get props => [chargingPoints];
}

class ChargingPointError extends ChargingPointState {
  final String message;

  const ChargingPointError(this.message);

  @override
  List<Object?> get props => [message];
}
