import 'package:ev_point_session/features/charging_session/data/datasources/booking_remote_datasource.dart';
import 'package:ev_point_session/features/charging_session/data/models/booking_model.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/ibooking_repository.dart';

class BookingRepositoryImpl implements IbookingRepository {
  final IBookingRemoteDatasource remoteDatasource;
  BookingRepositoryImpl(this.remoteDatasource);

  @override
  Future<BookingModel> getBookingByBookingCode(String bookingCode) {
    return remoteDatasource.getBookingByBookingCode(bookingCode);
  }
}