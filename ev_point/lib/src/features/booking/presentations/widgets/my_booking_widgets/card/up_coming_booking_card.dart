import 'package:flutter/material.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/build/build_detail.dart';
import 'package:qr_flutter/qr_flutter.dart';

class UpComingBookingCard extends StatelessWidget {
  final String bookingId;
  final String userId;
  final String stationId;
  final String chargingPointId;

  final String date;
  final String time;
  final String name;
  final String bookingCode;
  final String vehicalName;
  final String vehialNumber;
  final String address;
  final int powerKw;
  final int pricePerKwh;
  final String timeStart;
  final int pointNumber;
  final bool hasReminder;

  final VoidCallback? onCancelPressed;
  final VoidCallback? onShowQrPressed;

  const UpComingBookingCard({
    super.key,
    required this.bookingId,
    required this.userId,
    required this.stationId,
    required this.date,
    required this.time,
    required this.name,
    required this.bookingCode,
    required this.vehicalName,
    required this.vehialNumber,
    required this.address,
    required this.powerKw,
    required this.pricePerKwh,
    required this.timeStart,
    required this.pointNumber,
    required this.chargingPointId,
    required this.hasReminder,
    this.onCancelPressed,
    this.onShowQrPressed,
  });

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            title: const Text("Xác nhận hủy đặt chỗ"),
            content: const Text("Bạn có chắc chắn muốn hủy đặt chỗ này không?"),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text("Không"),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Bạn đã chọn hủy đặt chỗ"),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
                child: const Text(
                  "Hủy đặt chỗ",
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ],
          ),
    );
  }

  String buildBookingQrData() {
    return '''
{
  "bookingCode": "$bookingCode",
  "user_id": "$userId",
  "station_id": "$stationId",
  "charging_point_id": "$chargingPointId",
  "stationName": "$name",
  "address": "$address",
  "date": "$date",
  "time": "$time",
  "vehicleName": "$vehicalName",
  "vehicleNumber": "$vehialNumber",
  "powerKw": $powerKw,
  "pricePerKwh": $pricePerKwh,
  "pointNumber": $pointNumber
}
''';
  }

  void _openQrDialog(BuildContext context) {
    final qrData = buildBookingQrData();

    showDialog(
      context: context,
      builder:
          (_) => Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "Mã QR đặt chỗ",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  QrImageView(
                    data: qrData,
                    version: QrVersions.auto,
                    size: 230,
                    backgroundColor: Colors.white,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "Quét tại trạm sạc để bắt đầu sạc",
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Đóng"),
                  ),
                ],
              ),
            ),
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool reminderEnabled = hasReminder;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      date,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      time,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Text('Nhắc tôi', style: TextStyle(fontSize: 13)),
                    const SizedBox(width: 8),
                    StatefulBuilder(
                      builder: (context, setStateSB) {
                        return Switch(
                          value: reminderEnabled,
                          onChanged: (bool value) {
                            setStateSB(() => reminderEnabled = value);
                          },
                          activeColor: Colors.teal,
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Station info
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.teal.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.location_on,
                    color: Colors.teal,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        address,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Detail row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                BuildDetail(
                  icon: Icons.ev_station,
                  label: 'Công suất',
                  value: '$powerKw kW',
                ),
                const SizedBox(width: 20),
                BuildDetail(
                  icon: Icons.access_time,
                  label: 'Thời gian',
                  value: timeStart,
                ),
                const SizedBox(width: 20),
                BuildDetail(
                  icon: Icons.point_of_sale,
                  label: 'Điểm sạc',
                  value: pointNumber.toString(),
                ),
                const Spacer(),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Buttons
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed:
                        onCancelPressed ?? () => _showCancelDialog(context),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.teal, width: 2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text(
                      'Hủy đặt chỗ',
                      style: TextStyle(
                        color: Colors.teal,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: onShowQrPressed ?? () => _openQrDialog(context),

                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.teal,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Xem mã QR',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Note
          Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.teal.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline, color: Colors.teal.shade700, size: 20),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'Cắm đầu sạc vào xe để bắt đầu sạc. Sau 15 phút nếu không sạc, đặt chỗ sẽ tự động bị hủy.',
                    style: TextStyle(fontSize: 12, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
