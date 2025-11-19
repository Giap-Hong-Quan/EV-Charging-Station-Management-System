import 'package:ev_point/src/features/booking/domain/entities/booking_detail.dart';
import 'package:ev_point/src/features/booking/domain/usecase/cancel_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/create_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/get_booking_by_user_id.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_id.dart';
import 'package:ev_point/src/features/map/domain/usecase/get_station_by_id.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BookingCubit extends Cubit<BookingState> {
  final CreateBooking createBookingUseCase;
  final GetBookingByUserId getBookingByUserIdUseCase;
  final GetStationById getStationByIdUseCase;
  final GetChargingPointById getChargingPointByIdUseCase;
  final CancelBooking cancelBookingUseCase;
  BookingCubit({
    required this.createBookingUseCase,
    required this.getBookingByUserIdUseCase,
    required this.getStationByIdUseCase,
    required this.getChargingPointByIdUseCase,
    required this.cancelBookingUseCase,
  }) : super(BookingInitial());

  Future<void> createBooking({
    required String userId,
    required String vehicleName,
    required String vehicleNumber,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  }) async {
    emit(BookingLoading());
    try {
      final booking = await createBookingUseCase(
        userId: userId,
        vehicleName: vehicleName,
        vehicleNumber: vehicleNumber,
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

  Future<void> getUserBookingsWithDetails({required String userId}) async {
    emit(BookingLoading());
    try {
      final bookings = await getBookingByUserIdUseCase(userId: userId);

      final bookingDetails = await Future.wait(
        bookings.map((booking) async {
          final station = await getStationByIdUseCase(booking.stationId);
          final chargingPoint = await getChargingPointByIdUseCase(
            booking.pointId,
          );

          return BookingDetail(
            booking: booking, 
            station: station,
            chargingPoint: chargingPoint,
          );
        }),
      );

      emit(MyBookingDetailLoaded(bookingDetails)); 
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }

  Future<void> cancelBooking({required String bookingId}) async {
    emit(BookingLoading());
    try {
      final canceledBooking = await cancelBookingUseCase(bookingId: bookingId);
      emit(BookingCreated(canceledBooking));
    } catch (e) {
      emit(BookingError(e.toString()));
    }
  }
}
