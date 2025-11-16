import 'package:flutter/material.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/qr_scanner_screen.dart';

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
  
  // THÊM callback để chuyển về manual input
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
    this.onScanComplete,
  });

  void _fillFormFromQRData(BuildContext context, String qrData) {
    try {
      debugPrint('Parsing QR Data: $qrData');
      final parsedData = _parseQRData(qrData);
      debugPrint('Parsed Data: $parsedData');

      // Fill các text fields
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
      } else if (parsedData['time'] != null) {
        timeStartController.text = parsedData['time']!;
      }

      // Update power level dropdown
      if (parsedData['power'] != null && parsedData['power']!.isNotEmpty) {
        onPowerLevelChanged(parsedData['power']);
      }

      // Update duration nếu có
      if (parsedData['duration'] != null && parsedData['duration']!.isNotEmpty) {
        onTimeStartChanged(parsedData['duration']);
      }

      // Hiển thị thông báo thành công
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
        
        // Gọi callback để parent chuyển về manual input
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

    if (qrData.contains('\n')) {
      // Format theo dòng với dấu ":"
      for (final line in qrData.split('\n')) {
        final trimmed = line.trim();
        if (trimmed.isEmpty) continue;
        
        final colonIndex = trimmed.indexOf(':');
        if (colonIndex != -1) {
          final key = trimmed.substring(0, colonIndex).trim().toLowerCase();
          final value = trimmed.substring(colonIndex + 1).trim();
          result[key] = value;
        }
      }
    } else if (qrData.contains(';')) {
      // Format dạng key=value;key2=value2
      for (final pair in qrData.split(';')) {
        final parts = pair.split('=');
        if (parts.length >= 2) {
          final key = parts.first.trim().toLowerCase();
          final value = parts.sublist(1).join('=').trim();
          if (key.isNotEmpty) result[key] = value;
        }
      }
    } else if (qrData.contains(',')) {
      // Format dạng key=value,key2=value2
      for (final pair in qrData.split(',')) {
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
        debugPrint('QR Scanned in BuildQrScannerView: $data');
        _fillFormFromQRData(context, data);
      },
    );
  }
}