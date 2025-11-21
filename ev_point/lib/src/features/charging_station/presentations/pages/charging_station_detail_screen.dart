
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/charging_station_detail_card.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/charging_station_filter_chip.dart';
import 'package:flutter/material.dart';

class ChargingStationDetailScreen extends StatelessWidget {
  final List<ChargingStation> chargingStation;

  const ChargingStationDetailScreen({super.key, required this.chargingStation});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.grey[50],
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green[600]!, Colors.teal[600]!],
                  ),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.white,
                          ),
                          onPressed: () {},
                        ),
                        const Text(
                          'Quay lại',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                       'Trạm sạc gần bạn',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Tìm thấy ${chargingStation.length} trạm',
                        style: TextStyle(color: Colors.green[100]),
                      ),
                    ),
                  ],
                ),
              ),

              // Filters
               Container(
                color: Colors.white,
                padding: const EdgeInsets.all(16),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ChargingStationFilterChip(label: 'Tất cả', isActive: true),
                      ChargingStationFilterChip(label: 'Sạc nhanh', isActive: false),
                      ChargingStationFilterChip(label: 'Có sẵn', isActive: false),
                      ChargingStationFilterChip(label: 'Giá tốt', isActive: false),
                      ChargingStationFilterChip(label: 'Gần nhất', isActive: false),
                    ],
                  ),
                ),
              ),

              // Station Details
             Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: chargingStation.length,
                  itemBuilder: (context, index) {
                    return ChargingStationDetailCard(chargingStation: chargingStation[index]);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}