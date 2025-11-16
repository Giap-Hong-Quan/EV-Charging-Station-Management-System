import 'package:flutter/material.dart';

class ChargingSessionStartScreen extends StatelessWidget {
  final String bookingCode;
  final String vehicleName;
  final String vehicleNumber;
  final String timeStart;
  final String? powerLevel;

  const ChargingSessionStartScreen({
    super.key,
    required this.bookingCode,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.timeStart,
    this.powerLevel,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bắt đầu phiên sạc')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Booking: $bookingCode'),
            Text('Xe: $vehicleName'),
            Text('Biển số: $vehicleNumber'),
            Text('Thời gian bắt đầu: $timeStart'),
            if (powerLevel != null) Text('Công suất: $powerLevel kW'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
              },
              child: const Text('Start charging'),
            ),
          ],
        ),
      ),
    );
  }
}
