import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';

class CancelBooking {
  final IBookingRepository bookingRepository;

  CancelBooking(this.bookingRepository);

  Future<Booking> call({required String bookingId}) {
    return bookingRepository.cancelBooking(bookingId: bookingId);
  }
}
