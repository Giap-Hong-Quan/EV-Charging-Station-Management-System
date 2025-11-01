import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';

class CreateBooking{
  final IBookingRepository repository;
  CreateBooking(this.repository);
  Future<Booking> call({required String userId, required String stationId, required String pointId, required DateTime scheduleStartTime, required DateTime scheduleEndTime}) {
    return repository.createBooking(
      userId: userId,
      stationId: stationId,
      pointId: pointId,
      scheduleStartTime: scheduleStartTime,
      scheduleEndTime: scheduleEndTime,
    );
  }
}