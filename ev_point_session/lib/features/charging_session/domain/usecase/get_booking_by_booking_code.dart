import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/ibooking_repository.dart';

class GetBookingByBookingCode {
  final IbookingRepository repository;
  GetBookingByBookingCode(this.repository);
  Future<Booking> call(String bookingCode) {
    return repository.getBookingByBookingCode(bookingCode);
  } 
}