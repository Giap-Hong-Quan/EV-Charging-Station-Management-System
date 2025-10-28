import '../entities/booking.dart';

abstract class IBookingRepository{
  Future<Booking> createBooking();
}