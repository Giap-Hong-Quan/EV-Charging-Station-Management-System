import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/canceled_booking_card.dart';
import 'package:flutter/material.dart';

class MyBookingCanceled extends StatelessWidget {
  final List<Booking> bookings;
  const MyBookingCanceled({super.key, required this.bookings});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        CanceledBookingCard(
          date: 'Dec 03, 2024',
          time: '15:30 PM',
          name: 'MTP Parking 755 Kent Ave',
          address: 'Brooklyn, 755 Kent Ave',
          power: '50 kW',
          duration: '30 mins',
          amount: '\$8.50',
        ),
        const SizedBox(height: 16),
        CanceledBookingCard(
          date: 'Nov 18, 2024',
          time: '12:30 AM',
          name: 'ImPark 353 4th Ave',
          address: 'Brooklyn, 353 4th Ave',
          power: '100 kW',
          duration: '1 hour',
          amount: '\$14.25',
        ),
      ],
    );
  }
}