import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';

class GetBookingByUserId {
  final IBookingRepository bookingRepository;

  GetBookingByUserId(this.bookingRepository);

  Future<List<Booking>> call({required String userId}) {
    return bookingRepository.getUserBookings(userId: userId);
  }
}