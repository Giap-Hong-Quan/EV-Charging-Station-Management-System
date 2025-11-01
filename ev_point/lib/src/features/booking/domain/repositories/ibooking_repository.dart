import '../entities/booking.dart';

abstract class IBookingRepository {
  Future<Booking> createBooking({
    required String userId,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  });
}
