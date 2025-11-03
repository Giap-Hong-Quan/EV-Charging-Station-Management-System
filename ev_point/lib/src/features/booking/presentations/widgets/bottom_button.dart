import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:go_router/go_router.dart';

class BottomButton extends StatelessWidget {
  final String userId;
  final String stationId;
  final String pointId;
  final DateTime scheduleStartTime;
  final DateTime scheduleEndTime;

  const BottomButton({
    super.key,
    required this.userId,
    required this.stationId,
    required this.pointId,
    required this.scheduleStartTime,
    required this.scheduleEndTime,
  });

  @override
  Widget build(BuildContext context) {
    return BlocListener<BookingCubit, BookingState>(
      listener: (context, state) {
        if (state is BookingCreated) {
          Navigator.pop(context); // Go back
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Đặt chỗ thành công!'),
              backgroundColor: Color(0xFF00C853),
            ),
          );
          context.go(RouterPaths.myBookingScreen);
        } else if (state is BookingError) {
          Navigator.pop(context); // Close dialog if open
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Lỗi: ${state.message}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      child: Container(
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
      ),
    );
  }

  void _confirmBooking(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => BlocBuilder<BookingCubit, BookingState>(
        builder: (context, state) {
          return AlertDialog(
            title: const Text('Xác nhận đặt chỗ'),
            content: state is BookingLoading
                ? const Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 16),
                      Text('Đang xử lý...'),
                    ],
                  )
                : const Text('Xác nhận đặt chỗ sạc?'),
            actions: state is BookingLoading
                ? []
                : [
                    TextButton(
                      onPressed: () => Navigator.pop(dialogContext),
                      child: const Text('Hủy'),
                    ),
                    FilledButton(
                      onPressed: () {
                        context.read<BookingCubit>().createBooking(
                              userId: userId,
                              stationId: stationId,
                              pointId: pointId,
                              scheduleStartTime: scheduleStartTime,
                              scheduleEndTime: scheduleEndTime,
                            );
                      },
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF00C853),
                      ),
                      child: const Text('Xác nhận'),
                    ),
                  ],
          );
        },
      ),
    );
  }
}