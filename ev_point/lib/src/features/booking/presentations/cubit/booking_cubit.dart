import 'package:ev_point/src/features/booking/domain/usecase/create_booking.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BookingCubit extends Cubit<BookingState> {
  final CreateBooking createBookingUseCase;
  BookingCubit({required this.createBookingUseCase}) : super(BookingInitial());

  Future<void> createBooking({
    required String userId,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  }) async {
    emit(BookingLoading());
    try {
      final booking = await createBookingUseCase(
        userId: userId,
        stationId: stationId,
        pointId: pointId,
        scheduleStartTime: scheduleStartTime,
        scheduleEndTime: scheduleEndTime,
      );
      emit(BookingCreated(booking));
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }
}