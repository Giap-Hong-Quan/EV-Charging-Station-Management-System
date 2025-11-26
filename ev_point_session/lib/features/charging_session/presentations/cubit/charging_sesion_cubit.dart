import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/create_charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/end_charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/get_booking_by_booking_code.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChargingSessionCubit extends Cubit<ChargingSessionState> {
  final GetBookingByBookingCode getBookingByBookingCodeUseCase;
  final CreateChargingSessionUC createChargingSessionUseCase;
  final EndChargingSessionUseCase endChargingSessionUseCase;

  ChargingSessionCubit(
    this.getBookingByBookingCodeUseCase,
    this.createChargingSessionUseCase,
    this.endChargingSessionUseCase,
  ) : super(ChargingSessionLoading());

  Future<void> getBookingByBookingCode(String bookingCode) async {
    try {
      emit(ChargingSessionLoading());
      final booking = await getBookingByBookingCodeUseCase(bookingCode);

      emit(ChargingSessionChecked(booking));
    } catch (e) {
      emit(ChargingSessionError('Failed to fetch booking: $e'));
    }
  }

  Future<void> createChargingSession(
    RequestCreateChargingSessionDto requestDto,
  ) async {
    try {
      emit(ChargingSessionLoading());
      final chargingSession = await createChargingSessionUseCase(requestDto);

      emit(ChargingSessionCreated(chargingSession));
    } catch (e) {
      emit(ChargingSessionError('Failed to create charging session: $e'));
    }
  }

  Future<void> stopChargingSession(
    RequestEndChargingSessionDto requestDto,
  ) async {
    try {
      emit(ChargingSessionLoading());
      final chargingSession = await endChargingSessionUseCase(requestDto);

      emit(ChargingSessionStoppedSuccess(chargingSession));
    } catch (e) {
      emit(ChargingSessionError('Failed to end charging session: $e'));
    }
  }
}
