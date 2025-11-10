// lib/src/features/booking/presentation/screens/booking_detail_screen.dart
import 'package:ev_point/src/features/booking/presentations/widgets/bottom_button.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/charger_selection.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/charging_point_selection.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/datetime_selection.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/station_selection.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/time_selection_section.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/vehicle_selection.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/warning_banner.dart';
import 'package:flutter/material.dart';
import '../../../charging_point/domain/entities/charging_point.dart';
import '../../../map/domain/entities/station.dart';

class BookingScreen extends StatefulWidget {
  final Station station;

  const BookingScreen({super.key, required this.station});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  String selectedVehicle = 'Tesla Model 3';
  String selectedCharger = 'Tesla (Plug)';
  ChargingPoint? selectedPoint;
  DateTime? selectedStartTime;
  DateTime? selectedEndTime;

  void cancelBooking() {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Hủy đặt chỗ'),
            content: const Text('Bạn có chắc muốn hủy đặt chỗ này không?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Không'),
              ),
              FilledButton(
                onPressed: () {
                  Navigator.pop(context); 
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Đã hủy đặt chỗ'),
                      backgroundColor: Colors.red,
                    ),
                  );
                },
                style: FilledButton.styleFrom(backgroundColor: Colors.red),
                child: const Text('Hủy đặt chỗ'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String stationId = widget.station.id;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Đặt chỗ sạc',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () {
              // More options
            },
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            VehicleSelection(),
            const SizedBox(height: 24),
            StationSelection(station: widget.station),
            const SizedBox(height: 24),
            ChargerSelection(station: widget.station),
            const SizedBox(height: 24),
            DatetimeSelection(),
            const SizedBox(height: 24),
            ChargingPointSelection(
              stationId: stationId,
              onChanged: (point) {
                setState(() => selectedPoint = point);
              },
            ),
             if (selectedPoint != null) ...[
              const SizedBox(height: 24),
               TimeSelectionSection(
                onStartTimeChanged: (time) {
                  setState(() => selectedStartTime = time);
                },
                onEndTimeChanged: (time) {
                  setState(() => selectedEndTime = time);
                },
              ),
            ],
            const SizedBox(height: 24),
            WarningBanner(),

            const SizedBox(height: 100), 
          ],
        ),
      ),
      bottomSheet: BottomButton(
        userId: 'user123456',
        stationId: stationId,
        pointId: selectedPoint?.id ?? '',
        scheduleStartTime: selectedStartTime ?? DateTime.now(),
        scheduleEndTime: selectedEndTime ?? DateTime.now().add(Duration(hours: 1)),
      ),
    );
  }
}
