import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:go_router/go_router.dart';

class BottomButton extends StatelessWidget {
  final String userId;
  final String stationId;
  final String vehicleName;
  final String vehicleNumber;
  final String pointId;
  final DateTime scheduleStartTime;
  final DateTime scheduleEndTime;

  const BottomButton({
    super.key,
    required this.userId,
    required this.stationId,
    required this.vehicleName,
    required this.vehicleNumber,
    required this.pointId,
    required this.scheduleStartTime,
    required this.scheduleEndTime,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: () => _confirmBooking(context),
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFFE8F5E9),
              foregroundColor: const Color(0xFF00C853),
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            child: const Text(
              'Xác nhận đặt chỗ',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        ),
      ),
    );
  }

  void _confirmBooking(BuildContext context) {
    // Validate inputs
    if (vehicleName.isEmpty || vehicleNumber.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng nhập thông tin xe'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    if (pointId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng chọn điểm sạc'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => BlocConsumer<BookingCubit, BookingState>(
        listener: (context, state) {
          if (state is BookingCreated) {
            // Close dialog
            Navigator.of(dialogContext, rootNavigator: true).pop();

            // Update charging point status
            context.read<ChargingPointCubit>().updateChargingPointStatus(
                  chargingPointId: pointId,
                  status: 'Reservation',
                );

            // Show success message
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.white),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Đặt chỗ thành công!',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                backgroundColor: Color(0xFF00C853),
                duration: Duration(seconds: 2),
                behavior: SnackBarBehavior.floating,
              ),
            );

            context.go(RouterPaths.myBookingScreen);  

          } else if (state is BookingError) {
            // Close dialog
            Navigator.of(dialogContext, rootNavigator: true).pop();

            // Show error with retry option
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.white),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        state.message,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                backgroundColor: Colors.red,
                duration: const Duration(seconds: 4),
                behavior: SnackBarBehavior.floating,
                action: SnackBarAction(
                  label: 'Thử lại',
                  textColor: Colors.white,
                  onPressed: () => _confirmBooking(context),
                ),
              ),
            );
          }
        },
        builder: (context, state) {
          return AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            title: Row(
              children: [
                Icon(
                  state is BookingLoading
                      ? Icons.hourglass_empty
                      : Icons.ev_station,
                  color: const Color(0xFF00C853),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Xác nhận đặt chỗ',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ),
              ],
            ),
            content: state is BookingLoading
                ? const Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(
                        color: Color(0xFF00C853),
                        strokeWidth: 3,
                      ),
                      SizedBox(height: 20),
                      Text(
                        'Đang xử lý đặt chỗ...',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Vui lòng đợi',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  )
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Thông tin đặt chỗ:',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildInfoRow(Icons.directions_car, 'Xe', vehicleName),
                      _buildInfoRow(Icons.pin, 'Biển số', vehicleNumber),
                      _buildInfoRow(
                        Icons.access_time,
                        'Thời gian',
                        _formatTimeRange(),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF3E0),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.info_outline,
                              size: 20,
                              color: Colors.orange[800],
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Vui lòng đến đúng giờ để tránh mất chỗ',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.orange[800],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
            actions: state is BookingLoading
                ? null
                : [
                    TextButton(
                      onPressed: () => Navigator.of(dialogContext).pop(),
                      child: const Text(
                        'Hủy',
                        style: TextStyle(
                          color: Colors.grey,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    FilledButton(
                      onPressed: () {
                        print('🚀 Creating booking...');
                        print('   User ID: $userId');
                        print('   Station ID: $stationId');
                        print('   Point ID: $pointId');
                        print('   Vehicle: $vehicleName ($vehicleNumber)');
                        print('   Time: ${_formatTimeRange()}');

                        context.read<BookingCubit>().createBooking(
                              userId: userId,
                              vehicleName: vehicleName,
                              vehicleNumber: vehicleNumber,
                              stationId: stationId,
                              pointId: pointId,
                              scheduleStartTime: scheduleStartTime,
                              scheduleEndTime: scheduleEndTime,
                            );
                      },
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF00C853),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Xác nhận',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: TextStyle(
              fontSize: 13,
              color: Colors.grey[600],
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  String _formatTimeRange() {
    final start = _formatTime(scheduleStartTime);
    final end = _formatTime(scheduleEndTime);
    return '$start - $end';
  }

  String _formatTime(DateTime time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}