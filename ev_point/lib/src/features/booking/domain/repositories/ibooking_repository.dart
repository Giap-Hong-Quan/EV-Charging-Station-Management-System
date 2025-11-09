import '../entities/booking.dart';

abstract class IBookingRepository {
  Future<Booking> createBooking({
    required String userId,
    required String vehicleName,
    required String vehicleNumber,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  });
  Future<List<Booking>> getUserBookings({
    required String userId,
  });
  Future<Booking> cancelBooking({
    required String bookingId,
  });
}
