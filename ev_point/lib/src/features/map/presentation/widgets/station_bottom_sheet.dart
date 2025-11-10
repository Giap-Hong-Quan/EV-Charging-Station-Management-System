// lib/src/features/map/presentation/widgets/station_bottom_sheet.dart
import 'package:ev_point/src/core/utils/extensions.dart';
import 'package:flutter/material.dart';
import '../../domain/entities/station.dart';

class StationBottomSheet extends StatelessWidget {
  final Station station;
  final VoidCallback onNavigate;
  final VoidCallback onBooking;

  const StationBottomSheet({
    super.key,
    required this.station,
    required this.onNavigate,
    required this.onBooking,
  });

  static void show(
      BuildContext context, {
        required Station station,
        required VoidCallback onNavigate,
        required VoidCallback onBooking,
      }) {
    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => StationBottomSheet(
        station: station,
        onNavigate: onNavigate,
        onBooking: onBooking,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          const SizedBox(height: 8),
          _buildAddress(),
          const SizedBox(height: 12),
          _buildDetails(),
          const SizedBox(height: 12),
          _buildActions(context),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        _buildStatusDot(),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            station.name,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        Text(
          station.availabilityText,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  Widget _buildStatusDot() {
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: station.statusColor,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildAddress() {
    return Row(
      children: [
        const Icon(Icons.location_on, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Expanded(
          child: Text(
            station.address,
            style: const TextStyle(color: Colors.grey),
          ),
        ),
      ],
    );
  }

  Widget _buildDetails() {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        _buildChip('Chuẩn: ${station.connectorType}'),
        _buildChip('Công suất: ${station.powerKw} kW'),
        _buildChip('Giá: ${station.pricePerKwh.toVND()} / kWh'),
      ],
    );
  }

  Widget _buildChip(String text) {
    return Chip(
      label: Text(text),
      visualDensity: VisualDensity.compact,
    );
  }

  Widget _buildActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: FilledButton.icon(
            onPressed: () {
              Navigator.pop(context);
              onNavigate();
            },
            icon: const Icon(Icons.map),
            label: const Text('Đi tới'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () {
              Navigator.pop(context);
              onBooking();
            },
            icon: const Icon(Icons.charging_station),
            label: const Text('Chi tiết / Đặt chỗ'),
          ),
        ),
      ],
    );
  }
}