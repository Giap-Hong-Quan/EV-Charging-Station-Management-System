import 'package:ev_point/src/features/booking/data/datasources/booking_datasource.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';

class BookingRepositoryImpl implements IBookingRepository {
  final IBookingDatasource bookingDatasource;
  BookingRepositoryImpl(this.bookingDatasource);
  @override
  Future<Booking> createBooking({
    required String userId,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  }) {
    return bookingDatasource.createBooking(
      userId: userId,
      stationId: stationId,
      pointId: pointId,
      scheduleStartTime: scheduleStartTime,
      scheduleEndTime: scheduleEndTime,
    );
  }
  
  @override
  Future<List<Booking>> getUserBookings({required String userId}) {
    return bookingDatasource.getUserBookings(userId: userId);
  } 
}