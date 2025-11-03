// lib/src/features/booking/presentations/widgets/my_booking_widgets/my_booking_completed.dart
import 'package:flutter/material.dart';
import 'completed_booking_card.dart';
import '../../../domain/entities/booking.dart'; 

class MyBookingCompleted extends StatelessWidget {
  final List<Booking> bookings;
  const MyBookingCompleted({super.key, required this.bookings});

  @override
  Widget build(BuildContext context) {
    if (bookings.isEmpty) {
      return Center(
        child: Text('No completed bookings', style: TextStyle(color: Colors.grey[600])),
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
        return CompletedBookingCard(
          date: date,
          time: time,
          name: b.stationId,
          address: b.stationId,
          power: '${b.id} kW',
          duration: b.userId,
          amount: b.userId,
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
