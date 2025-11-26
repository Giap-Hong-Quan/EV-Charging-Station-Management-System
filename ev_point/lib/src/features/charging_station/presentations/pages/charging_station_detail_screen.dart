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
      appBar: AppBar(
        title: const Text(
          'Các trạm sạc gần bạn',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),

        centerTitle: true,
        backgroundColor: Colors.green[600],
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Container(
        color: Colors.grey[50],
        child: SafeArea(
          child: Column(
            children: [
              // Header

              // Filters
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(16),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      ChargingStationFilterChip(
                        label: 'Tất cả',
                        isActive: true,
                      ),
                      ChargingStationFilterChip(
                        label: 'Sạc nhanh',
                        isActive: false,
                      ),
                      ChargingStationFilterChip(
                        label: 'Có sẵn',
                        isActive: false,
                      ),
                      ChargingStationFilterChip(
                        label: 'Giá tốt',
                        isActive: false,
                      ),
                      ChargingStationFilterChip(
                        label: 'Gần nhất',
                        isActive: false,
                      ),
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
                    return ChargingStationDetailCard(
                      chargingStation: chargingStation[index],
                    );
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
