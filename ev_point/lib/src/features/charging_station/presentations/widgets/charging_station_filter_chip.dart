import 'package:flutter/material.dart';

class ChargingStationFilterChip extends StatelessWidget {
  final String label;
  final bool isActive;
  
  const ChargingStationFilterChip({super.key, required this.label, required this.isActive});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: Chip(
        label: Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : Colors.grey[600],
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: isActive ? Colors.green[600] : Colors.grey[100],
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
    );
  }
}