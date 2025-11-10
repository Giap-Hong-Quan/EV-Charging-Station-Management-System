import 'package:ev_point/src/features/booking/domain/usecase/create_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/get_booking_by_user_id.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BookingCubit extends Cubit<BookingState> {
  final CreateBooking createBookingUseCase;
  final GetBookingByUserId getBookingByUserIdUseCase;
  BookingCubit({required this.createBookingUseCase, required this.getBookingByUserIdUseCase}) : super(BookingInitial());

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

  Future<void> getUserBookings({required String userId}) async {
    emit(BookingLoading());
    try {
      final bookings = await getBookingByUserIdUseCase(userId: userId);
      emit(BookingsLoaded(bookings));
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }
}