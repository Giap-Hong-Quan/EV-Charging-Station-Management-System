import 'package:equatable/equatable.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/map/domain/entities/station.dart';

class BookingDetail extends Equatable {
  final Booking booking;
  final Station station;
  final ChargingPoint chargingPoint;

  const BookingDetail({
    required this.booking,
    required this.station,
    required this.chargingPoint,
  });

  @override
  List<Object?> get props => [booking, station, chargingPoint];
  BookingDetail copyWith({
  Booking? booking,
  Station? station,
  ChargingPoint? chargingPoint,
}) {
  return BookingDetail(
    booking: booking ?? this.booking,
    station: station ?? this.station,
    chargingPoint: chargingPoint ?? this.chargingPoint,
  );
}

}