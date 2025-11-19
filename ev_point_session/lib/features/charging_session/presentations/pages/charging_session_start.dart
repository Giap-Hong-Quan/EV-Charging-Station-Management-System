import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_active_screen.dart';
import 'package:flutter/material.dart';
// Import màn hình active (thay đổi path theo project của bạn)
// import 'charging_session_active_screen.dart';

class ChargingSessionStartScreen extends StatefulWidget {
  final String bookingCode;
  final String vehicleName;
  final String vehicleNumber;
  final String timeStart;

  const ChargingSessionStartScreen({
    super.key,
    required this.bookingCode,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.timeStart,
  });

  @override
  State<ChargingSessionStartScreen> createState() =>
      _ChargingSessionStartScreenState();
}

class _ChargingSessionStartScreenState
    extends State<ChargingSessionStartScreen> {
  int _targetBatteryPercent = 80;
  double _powerLevel = 7.2;

  void _startChargingSession() {
    // TODO: Gọi API để bắt đầu phiên sạc
    
    // Sau khi API thành công, navigate đến active screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChargingSessionActiveScreen(
          bookingCode: widget.bookingCode,
          vehicleName: widget.vehicleName,
          vehicleNumber: widget.vehicleNumber,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bắt đầu phiên sạc'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Booking info card
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.qr_code, color: Colors.teal.shade700),
                        const SizedBox(width: 8),
                        const Text(
                          'Thông tin đặt chỗ',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    _buildInfoRow('Mã booking', widget.bookingCode),
                    const SizedBox(height: 8),
                    _buildInfoRow('Tên xe', widget.vehicleName),
                    const SizedBox(height: 8),
                    _buildInfoRow('Biển số', widget.vehicleNumber),
                    const SizedBox(height: 8),
                    _buildInfoRow('Thời gian', widget.timeStart),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Battery target
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.battery_charging_full,
                            color: Colors.teal.shade700),
                        const SizedBox(width: 8),
                        const Text(
                          'Mục tiêu sạc',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Pin mục tiêu:'),
                        Text(
                          '$_targetBatteryPercent%',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.teal,
                          ),
                        ),
                      ],
                    ),
                    Slider(
                      value: _targetBatteryPercent.toDouble(),
                      min: 50,
                      max: 100,
                      divisions: 10,
                      label: '$_targetBatteryPercent%',
                      activeColor: Colors.teal,
                      onChanged: (value) {
                        setState(() {
                          _targetBatteryPercent = value.toInt();
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Power level
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.flash_on, color: Colors.teal.shade700),
                        const SizedBox(width: 8),
                        const Text(
                          'Công suất sạc',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Công suất:'),
                        Text(
                          '${_powerLevel.toStringAsFixed(1)} kW',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.teal,
                          ),
                        ),
                      ],
                    ),
                    Slider(
                      value: _powerLevel,
                      min: 3.0,
                      max: 22.0,
                      divisions: 19,
                      label: '${_powerLevel.toStringAsFixed(1)} kW',
                      activeColor: Colors.teal,
                      onChanged: (value) {
                        setState(() {
                          _powerLevel = value;
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildPowerLevelChip('Chậm', 3.7, Colors.green),
                        _buildPowerLevelChip('Trung bình', 7.2, Colors.orange),
                        _buildPowerLevelChip('Nhanh', 22.0, Colors.red),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Start button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                onPressed: _startChargingSession,
                icon: const Icon(Icons.electric_bolt, size: 28),
                label: const Text(
                  'Bắt đầu sạc',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildPowerLevelChip(String label, double power, Color color) {
    final isSelected = (_powerLevel - power).abs() < 0.5;
    return GestureDetector(
      onTap: () => setState(() => _powerLevel = power),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? color : Colors.grey[200],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: color,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : color,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

