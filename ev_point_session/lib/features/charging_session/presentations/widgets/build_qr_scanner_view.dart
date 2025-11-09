import 'package:flutter/material.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/qr_scanner_screen.dart';

class BuildQrScannerView extends StatelessWidget {
  // Controllers từ màn hình cha
  final TextEditingController bookingCodeController;
  final TextEditingController vehicleNameController;
  final TextEditingController vehicleNumberController;

  // State dropdown từ cha
  final String? selectedDuration;
  final String? selectedPowerLevel;

  // Callbacks để cập nhật state ở cha
  final ValueChanged<String?> onDurationChanged;
  final ValueChanged<String?> onPowerLevelChanged;

  const BuildQrScannerView({
    super.key,
    required this.bookingCodeController,
    required this.vehicleNameController,
    required this.vehicleNumberController,
    required this.selectedDuration,
    required this.selectedPowerLevel,
    required this.onDurationChanged,
    required this.onPowerLevelChanged,
  });

  void _fillFormFromQRData(BuildContext context, String qrData) {
    final parsedData = _parseQRData(qrData);

    // Map key-value theo format QR của bạn. Ví dụ:
    // booking: BK123, vehicle_name: Tesla, vehicle_number: 51A-123.45,
    // power: 22kW, duration: 1 hour
    bookingCodeController.text = parsedData['booking'] ?? '';
    vehicleNameController.text  = parsedData['vehicle_name'] ?? '';
    vehicleNumberController.text= parsedData['vehicle_number'] ?? '';

    if (parsedData['power'] != null && parsedData['power']!.isNotEmpty) {
      onPowerLevelChanged(parsedData['power']);
    }
    if (parsedData['duration'] != null && parsedData['duration']!.isNotEmpty) {
      onDurationChanged(parsedData['duration']);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Information loaded from QR code'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  Map<String, String> _parseQRData(String qrData) {
    // Hỗ trợ cả dạng "key:value" theo dòng, hoặc "key=value;key2=value2"
    final Map<String, String> result = {};

    if (qrData.contains('\n')) {
      for (final line in qrData.split('\n')) {
        final trimmed = line.trim();
        if (trimmed.isEmpty) continue;
        final parts = trimmed.split(':');
        if (parts.length >= 2) {
          final key = parts.first.trim().toLowerCase();
          final value = parts.sublist(1).join(':').trim();
          result[key] = value;
        }
      }
    } else if (qrData.contains(';')) {
      for (final pair in qrData.split(';')) {
        final parts = pair.split('=');
        if (parts.length >= 2) {
          final key = parts.first.trim().toLowerCase();
          final value = parts.sublist(1).join('=').trim();
          if (key.isNotEmpty) result[key] = value;
        }
      }
    }
    return result;
  }

  @override
  Widget build(BuildContext context) {
    return QrScannerScreen(
      onQrScannedSuccessfully: (data) {
        _fillFormFromQRData(context, data);
      },
    );
  }
}
