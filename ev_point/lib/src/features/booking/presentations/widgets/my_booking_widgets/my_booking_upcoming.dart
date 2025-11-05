// lib/src/features/booking/presentations/widgets/my_booking_widgets/my_booking_completed.dart
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/up_coming_booking_card.dart';
import 'package:flutter/material.dart';
import '../../../domain/entities/booking.dart'; 

class MyBookingUpcoming extends StatelessWidget {
  final List<Booking> bookings;
  const MyBookingUpcoming({super.key, required this.bookings});

  @override
  Widget build(BuildContext context) {
    if (bookings.isEmpty) {
      return Center(
        child: Text('No upcoming bookings', style: TextStyle(color: Colors.grey[600])),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
      itemCount: bookings.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, i) {
        final b = bookings[i];
        final start = b.scheduleStartTime; // DateTime
        final date = '${_mm(start.month)} ${_dd(start.day)}, ${start.year}';
        final time = '${_hh2(start.hour)}:${_hh2(start.minute)}';
        return UpComingBookingCard(
          date: date,
          time: time,
          name: b.stationId,
          address: b.stationId,
          power: '${b.id} kW',
          duration: b.userId,
          amount: b.userId,
          hasReminder: false,
        );
      },
    );
  }

  String _hh2(int n) => n.toString().padLeft(2, '0');
  String _dd(int n) => n.toString().padLeft(2, '0');
  String _mm(int m) => const [
    'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
  ][m-1];
}
