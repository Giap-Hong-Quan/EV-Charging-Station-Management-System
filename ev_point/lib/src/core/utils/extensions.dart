import 'package:flutter/material.dart';

import '../../features/map/domain/entities/station.dart';

extension StationExtension on Station {
  Color get statusColor {
    switch (status.toLowerCase()) {
      case 'online':
        return Colors.green;
      case 'offline':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  bool get isOnline => status.toLowerCase() == 'online';

  String get availabilityText => '$availablePoints/$totalPoints chỗ';
}

extension CurrencyFormatter on num {
  String toVND() {
    final s = toInt().toString();
    final buffer = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      final pos = s.length - i;
      buffer.write(s[i]);
      if (pos > 1 && pos % 3 == 1) buffer.write('.');
    }
    return '${buffer.toString()} đ';
  }
}

extension StringExtension on String {
  bool containsIgnoreCase(String other) {
    return toLowerCase().contains(other.toLowerCase());
  }
}