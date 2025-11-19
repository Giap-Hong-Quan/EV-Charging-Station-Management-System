import 'package:equatable/equatable.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking_detail.dart';

abstract class BookingState extends Equatable {
  const BookingState();

  @override
  List<Object?> get props => [];
}

class BookingInitial extends BookingState {}

class BookingLoading extends BookingState {}

class BookingCreated extends BookingState {
  final Booking booking;

  const BookingCreated(this.booking);

  @override
  List<Object?> get props => [booking];
}

class BookingsLoaded extends BookingState {
  final List<Booking> bookings;

  const BookingsLoaded(this.bookings);

  @override
  List<Object?> get props => [bookings];
}

class BookingError extends BookingState {
  final String message;

  const BookingError(this.message);

  @override
  List<Object?> get props => [message];
}

class MyBookingDetailLoaded extends BookingState {
  final List<BookingDetail> bookingDetails;

  const MyBookingDetailLoaded(this.bookingDetails);

  @override
  List<Object?> get props => [bookingDetails];
}
