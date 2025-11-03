import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/up_coming_booking_card.dart';
import 'package:flutter/material.dart';

class MyBookingUpcoming extends StatelessWidget {
  final List<Booking> bookings;
  const MyBookingUpcoming({super.key, required this.bookings});
  

  @override
  Widget build(BuildContext context) {
    if(bookings.isEmpty) {
      return const Center(
        child: Text('No upcoming bookings found.'),
      );
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      
      children: [
        UpComingBookingCard(
          date: 'Dec 17, 2024',
          time: '10:00 AM',
          name: 'Walgreens - Brooklyn, NY',
          address: 'Brooklyn, 1887 Prospect Avenue',
          power: '100 kW',
          duration: '1 hour',
          amount: '\$14.25',
          hasReminder: true,
        ),
      ],
    );
  }
}