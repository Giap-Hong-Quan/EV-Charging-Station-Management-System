import 'package:ev_point_session/features/charging_session/domain/usecase/get_booking_by_booking_code.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChargingSessionCubit extends Cubit<ChargingSessionState> {
  final GetBookingByBookingCode getBookingByBookingCodeUseCase;

  ChargingSessionCubit(this.getBookingByBookingCodeUseCase)
      : super(ChargingSessionLoading());


  Future<void> getBookingByBookingCode(String bookingCode) async {
    try {
      emit(ChargingSessionLoading());
      final booking = await getBookingByBookingCodeUseCase(bookingCode);
      
      emit(ChargingSessionChecked(booking));

    } catch (e) {
      emit(ChargingSessionError('Failed to fetch booking: $e'));
    }
  }
  
}