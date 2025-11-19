import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';

abstract class IbookingRepository {
  Future<Booking> getBookingByBookingCode(String bookingCode);
}