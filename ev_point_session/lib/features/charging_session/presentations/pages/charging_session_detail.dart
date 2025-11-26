import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_payment_dto.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

class SessionDetailPaymentScreen extends StatelessWidget {
  final String sessionId;
  final String userId;
  final String stationId;
  final String sessionCode;
  final String vehicleName;
  final String vehicleNumber;
  final DateTime startTime;
  final DateTime endTime;
  final int startSocPercent;
  final int endSocPercent;
  final int powerKWh;
  final int pricePerKWh;
  final int totalCost;
  final String stationName;
  final int chargingPointNumber;

  const SessionDetailPaymentScreen({
    super.key,
    required this.sessionId,
    required this.userId,
    required this.stationId,
    required this.sessionCode,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.startTime,
    required this.endTime,
    required this.startSocPercent,
    required this.endSocPercent,
    required this.powerKWh,
    required this.totalCost,
    required this.pricePerKWh,
    required this.stationName,
    required this.chargingPointNumber,
  });

  Duration get _chargingDuration => endTime.difference(startTime);

  int get _batteryCharged => endSocPercent - startSocPercent;

  double get _energyConsumed => (_batteryCharged / 100) * 60;

  double get _totalCost => _energyConsumed * pricePerKWh;

  String _formatDuration(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    if (hours > 0) {
      return '${hours}h ${minutes}m';
    }
    return '${minutes}m';
  }

  String _formatDateTime(DateTime dateTime) {
    return DateFormat('dd/MM/yyyy HH:mm').format(dateTime);
  }

  String _formatCurrency(double amount) {
    return NumberFormat('#,###', 'vi_VN').format(amount);
  }

  @override
  Widget build(BuildContext context) {
    print("Duration time: $_chargingDuration, Energy: $_energyConsumed, Total Cost: $_totalCost");
    return Scaffold(
      backgroundColor: const Color(0xFF0A1929),
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(context),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSuccessHeader(),
                    const SizedBox(height: 24),
                    _buildSessionInfo(),
                    const SizedBox(height: 20),
                    _buildVehicleInfo(),
                    const SizedBox(height: 20),
                    _buildChargingStats(),
                    const SizedBox(height: 20),
                    _buildPaymentSummary(),
                    const SizedBox(height: 24),
                    _buildActionButtons(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          const Expanded(
            child: Text(
              'Chi tiết phiên sạc',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 48), // Balance the back button
        ],
      ),
    );
  }

  Widget _buildSuccessHeader() {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              const Color(0xFF00D9FF).withOpacity(0.2),
              const Color(0xFF00D9FF).withOpacity(0.05),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF00D9FF).withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF00D9FF).withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle,
                size: 48,
                color: Color(0xFF00D9FF),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Sạc hoàn tất!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Thời gian sạc: ${_formatDuration(_chargingDuration)}',
              style: const TextStyle(color: Colors.white70, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSessionInfo() {
    return _buildCard(
      title: 'Thông tin phiên sạc',
      children: [
        _buildInfoRow('Mã phiên', sessionCode),
        _buildDivider(),
        _buildInfoRow('Trạm sạc', stationName),
        _buildDivider(),
        _buildInfoRow('Điểm sạc', chargingPointNumber.toString()),
        _buildDivider(),
        _buildInfoRow('Bắt đầu', _formatDateTime(startTime)),
        _buildDivider(),
        _buildInfoRow('Kết thúc', _formatDateTime(endTime)),
      ],
    );
  }

  Widget _buildVehicleInfo() {
    return _buildCard(
      title: 'Thông tin xe',
      children: [
        _buildInfoRow('Tên xe', vehicleName),
        _buildDivider(),
        _buildInfoRow('Biển số', vehicleNumber),
      ],
    );
  }

  Widget _buildChargingStats() {
    return _buildCard(
      title: 'Thống kê sạc',
      children: [
        _buildStatRow(
          icon: Icons.battery_charging_full,
          label: 'Pin ban đầu',
          value: '$startSocPercent%',
          color: Colors.orange,
        ),
        _buildDivider(),
        _buildStatRow(
          icon: Icons.battery_full,
          label: 'Pin sau sạc',
          value: '$endSocPercent%',
          color: Colors.green,
        ),
        _buildDivider(),
        _buildStatRow(
          icon: Icons.add_circle_outline,
          label: 'Đã sạc',
          value: '+$_batteryCharged%',
          color: const Color(0xFF00D9FF),
        ),
        _buildDivider(),
        _buildStatRow(
          icon: Icons.bolt,
          label: 'Năng lượng tiêu thụ',
          value: '${_energyConsumed.toStringAsFixed(2)} kWh',
          color: const Color(0xFF00D9FF),
        ),
        _buildDivider(),
        _buildStatRow(
          icon: Icons.speed,
          label: 'Công suất',
          value: '$powerKWh kW',
          color: Colors.purple,
        ),
      ],
    );
  }

  Widget _buildPaymentSummary() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF00D9FF).withOpacity(0.15),
            const Color(0xFF00D9FF).withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF00D9FF).withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.receipt_long, color: Color(0xFF00D9FF), size: 24),
              SizedBox(width: 12),
              Text(
                'Thanh toán',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          _buildPaymentRow(
            'Đơn giá',
            '${_formatCurrency(pricePerKWh.toDouble())} ₫/kWh',
          ),
          const SizedBox(height: 12),
          _buildPaymentRow(
            'Năng lượng',
            '${_energyConsumed.toStringAsFixed(2)} kWh',
          ),
          const SizedBox(height: 16),
          Container(
            height: 1,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.transparent,
                  Colors.white.withOpacity(0.3),
                  Colors.transparent,
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Tổng cộng',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '${_formatCurrency(_totalCost)} ₫',
                style: const TextStyle(
                  color: Color(0xFF00D9FF),
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: () {
            
            context.push(PathRouters.paymentScreen,
                extra: RequestPaymentDto(
                  sessionId: sessionCode,
                  totalAmount: _totalCost,
                  userId: userId, // Replace with actual user ID
                  stationId: stationId, // Replace with actual station ID
                ));
            print("User ID: $userId, Station ID: $stationId");
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF00D9FF),
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 0,
          ),
          child: const Text(
            'Thanh toán',
            style: TextStyle(
              color: Color(0xFF0A1929),
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 12),
        // OutlinedButton(
        //   onPressed: () {
        //     // TODO: Implement download receipt
        //     ScaffoldMessenger.of(context).showSnackBar(
        //       const SnackBar(content: Text('Đang tải hóa đơn...')),
        //     );
        //   },
        //   style: OutlinedButton.styleFrom(
        //     minimumSize: const Size(double.infinity, 56),
        //     side: const BorderSide(color: Color(0xFF00D9FF), width: 2),
        //     shape: RoundedRectangleBorder(
        //       borderRadius: BorderRadius.circular(16),
        //     ),
        //   ),
        //   child: const Text(
        //     'Tải hóa đơn',
        //     style: TextStyle(
        //       color: Color(0xFF00D9FF),
        //       fontSize: 16,
        //       fontWeight: FontWeight.bold,
        //     ),
        //   ),
        // ),
      ],
    );
  }

  Widget _buildCard({required String title, required List<Widget> children}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A2F3F).withOpacity(0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.white60, fontSize: 14),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatRow({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 16),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 1,
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.transparent,
            Colors.white.withOpacity(0.1),
            Colors.transparent,
          ],
        ),
      ),
    );
  }
}
