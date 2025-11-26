import 'dart:convert';

import 'package:ev_point_session/features/charging_session/presentations/widgets/qr_scanner_screen.dart';
import 'package:flutter/material.dart';

class BuildQrScannerView extends StatelessWidget {
  // Controllers từ màn hình cha
  final TextEditingController bookingCodeController;
  final TextEditingController vehicleNameController;
  final TextEditingController vehicleNumberController;
  final TextEditingController timeStartController;

  // Giá trị hiện tại
  final String? selectedDuration;
  final String? selectedPowerLevel;

  // Callbacks để cập nhật state ở cha
  final ValueChanged<String?> onTimeStartChanged;
  final ValueChanged<String?> onPowerLevelChanged;

  // 🔥 NEW: callback để đẩy meta data từ QR về parent
  final ValueChanged<String?>? onUserIdChanged;
  final ValueChanged<String?>? onStationIdChanged;
  final ValueChanged<String?>? onChargingPointIdChanged;
  final ValueChanged<int?>? onPointNumberChanged;
  final ValueChanged<int?>? onPowerKWhChanged;
  final ValueChanged<int?>? onPricePerKWhChanged;
  final ValueChanged<String?>? onStationNameChanged;

  // Callback để chuyển về manual input
  final VoidCallback? onScanComplete;

  const BuildQrScannerView({
    super.key,
    required this.bookingCodeController,
    required this.vehicleNameController,
    required this.vehicleNumberController,
    required this.timeStartController,
    required this.selectedDuration,
    required this.selectedPowerLevel,
    required this.onTimeStartChanged,
    required this.onPowerLevelChanged,
    this.onUserIdChanged,
    this.onStationIdChanged,
    this.onChargingPointIdChanged,
    this.onPointNumberChanged,
    this.onPowerKWhChanged,
    this.onPricePerKWhChanged,
    this.onStationNameChanged,
    this.onScanComplete,
  });

  void _fillFormFromQRData(BuildContext context, String qrData) {
    try {
      debugPrint('Parsing QR Data: $qrData');
      final parsedData = _parseQRData(qrData);
      debugPrint('Parsed Data: $parsedData');

      // Text fields
      if (parsedData['bookingcode'] != null) {
        bookingCodeController.text = parsedData['bookingcode']!;
      } else if (parsedData['booking code'] != null) {
        bookingCodeController.text = parsedData['booking code']!;
      }

      if (parsedData['vehiclename'] != null) {
        vehicleNameController.text = parsedData['vehiclename']!;
      } else if (parsedData['vehicle name'] != null) {
        vehicleNameController.text = parsedData['vehicle name']!;
      }

      if (parsedData['vehiclenumber'] != null) {
        vehicleNumberController.text = parsedData['vehiclenumber']!;
      } else if (parsedData['vehicle number'] != null) {
        vehicleNumberController.text = parsedData['vehicle number']!;
      }

      if (parsedData['timestart'] != null) {
        timeStartController.text = parsedData['timestart']!;
        onTimeStartChanged(parsedData['timestart']);
      } else if (parsedData['time'] != null) {
        timeStartController.text = parsedData['time']!;
        onTimeStartChanged(parsedData['time']);
      }

      if (parsedData['user_id'] != null) {
        onUserIdChanged?.call(parsedData['user_id']);
      }
      if (parsedData['station_id'] != null) {
        onStationIdChanged?.call(parsedData['station_id']);
      }
      if (parsedData['charging_point_id'] != null) {
        onChargingPointIdChanged?.call(parsedData['charging_point_id']);
      }
      if (parsedData['pointnumber'] != null) {
        final pn = int.tryParse(parsedData['pointnumber']!);
        onPointNumberChanged?.call(pn);
      }

      // Power level
      if (parsedData['power'] != null && parsedData['power']!.isNotEmpty) {
        onPowerLevelChanged(parsedData['power']);
      }
      if (parsedData['powerkw'] != null) {
        onPowerKWhChanged?.call(int.parse(parsedData['powerkw']!));
      }

      if (parsedData['priceperkwh'] != null) {
        onPricePerKWhChanged?.call(int.parse(parsedData['priceperkwh']!));
      }
      if (parsedData['stationname'] != null) {
        onStationNameChanged?.call(parsedData['stationname']);
      }

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Text('Đã tải thông tin từ mã QR'),
              ],
            ),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );

        onScanComplete?.call();
      }
    } catch (e) {
      debugPrint('Error parsing QR: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.error, color: Colors.white),
                const SizedBox(width: 8),
                Expanded(child: Text('Lỗi đọc QR: $e')),
              ],
            ),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  Map<String, String> _parseQRData(String qrData) {
    final Map<String, String> result = {};

    // 1️⃣ thử parse JSON trước (QR của bạn đang là JSON)
    try {
      final dynamic decoded = jsonDecode(qrData);
      if (decoded is Map) {
        decoded.forEach((key, value) {
          if (key == null || value == null) return;
          final k =
              key.toString().trim().toLowerCase(); // bookingcode, user_id...
          final v = value.toString().trim();
          if (k.isNotEmpty && v.isNotEmpty) {
            result[k] = v;
          }
        });
        if (result.isNotEmpty) {
          return result;
        }
      }
    } catch (e) {
      debugPrint('QR not JSON, fallback other formats. Error: $e');
    }

    // 2️⃣ fallback các format cũ nếu sau này dùng
    if (qrData.contains('\n')) {
      for (final line in qrData.split('\n')) {
        final trimmed = line.trim();
        if (trimmed.isEmpty) continue;

        final colonIndex = trimmed.indexOf(':');
        if (colonIndex != -1) {
          final key = trimmed.substring(0, colonIndex).trim().toLowerCase();
          final value = trimmed.substring(colonIndex + 1).trim();
          if (key.isNotEmpty && value.isNotEmpty) {
            result[key] = value;
          }
        }
      }
    } else if (qrData.contains(';')) {
      for (final pair in qrData.split(';')) {
        final parts = pair.split('=');
        if (parts.length >= 2) {
          final key = parts.first.trim().toLowerCase();
          final value = parts.sublist(1).join('=').trim();
          if (key.isNotEmpty && value.isNotEmpty) {
            result[key] = value;
          }
        }
      }
    } else if (qrData.contains(',')) {
      for (final pair in qrData.split(',')) {
        final parts = pair.split('=');
        if (parts.length >= 2) {
          final key = parts.first.trim().toLowerCase();
          final value = parts.sublist(1).join('=').trim();
          if (key.isNotEmpty && value.isNotEmpty) {
            result[key] = value;
          }
        }
      }
    }

    return result;
  }

  @override
  Widget build(BuildContext context) {
    return QrScannerScreen(
      onQrScannedSuccessfully: (data) {
        debugPrint('QR Scanned in BuildQrScannerView: $data');
        _fillFormFromQRData(context, data);
      },
    );
  }
}
