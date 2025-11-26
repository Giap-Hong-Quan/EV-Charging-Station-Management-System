import 'package:ev_point/src/core/utils/app_color.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/build/buil_tab.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/my_booking_canceled.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/my_booking_completed.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/my_booking_upcoming.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MyBookingScreen extends StatefulWidget {
  const MyBookingScreen({super.key});

  @override
  State<MyBookingScreen> createState() => _MyBookingScreenState();
}

class _MyBookingScreenState extends State<MyBookingScreen> {
  int selectedIndex = 0;
  String? userId;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  void _loadBookings() {
    final user = context.read<UserCubit>().currentUser;
    if (user != null) {
      context.read<BookingCubit>().getUserBookings(userId: user.id.toString());
    }
    else{
      SnackBar(
        content: Text(
          'Vui lòng đăng nhập để xem đặt chỗ của bạn',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.red,
      );
    }
    
  }

  Future<void> refreshBookings() async {
    final user = context.read<UserCubit>().currentUser;
    if (user != null) {
      await context.read<BookingCubit>().getUserBookings(
        userId: user.id.toString(),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: const Text(
          'Đặt chỗ của tôi',
          style: TextStyle(
            color: AppColors.primary,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: AppColors.primary),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                BuildTab(
                  title: 'Sắp tới',
                  isSelected: selectedIndex == 0,
                  onTap: () => setState(() => selectedIndex = 0),
                ),
                BuildTab(
                  title: 'Đã hoàn thành',
                  isSelected: selectedIndex == 1,
                  onTap: () => setState(() => selectedIndex = 1),
                ),
                BuildTab(
                  title: 'Đã hủy',
                  isSelected: selectedIndex == 2,
                  onTap: () => setState(() => selectedIndex = 2),
                ),
              ],
            ),
          ),
          Expanded(
            child: BlocBuilder<BookingCubit, BookingState>(
              builder: (context, state) {
                print ("Rebuilding MyBookingScreen with state: $state");
                // Loading state
                if (state is BookingInitial || state is BookingLoading) {
                  return const Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  );
                }

                // Error state
                if (state is BookingError) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 80,
                            color: Colors.red[300],
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Không thể tải đặt chỗ',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            state.message,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                          const SizedBox(height: 32),
                          ElevatedButton.icon(
                            onPressed: _loadBookings,
                            icon: const Icon(
                              Icons.refresh,
                              color: Colors.white,
                            ),
                            label: const Text(
                              'Thử lại',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 14,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                // Success state with data
                if (state is BookingsLoaded) {
                  final allBookings = state.bookings;
                  print("Total bookings loaded: ${allBookings.length}");
                  print(
                    "User ID for bookings: ${context.read<UserCubit>().currentUser?.id}",
                  );

                  // Empty state
                  if (allBookings.isEmpty) {
                    return RefreshIndicator(
                      onRefresh: refreshBookings,
                      color: AppColors.primary,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.inbox_outlined,
                                  size: 100,
                                  color: Colors.grey[400],
                                ),
                                const SizedBox(height: 24),
                                Text(
                                  'Chưa có đặt chỗ nào',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Kéo xuống để làm mới',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  // Filter bookings by status
                  final upcoming =
                      allBookings
                          .where((b) => b.status.toUpperCase() == 'UPCOMING')
                          .toList();

                  final completed =
                      allBookings
                          .where((b) => b.status.toUpperCase() == 'COMPLETED')
                          .toList();

                  final canceled =
                      allBookings
                          .where((b) => b.status.toUpperCase() == 'CANCELLED')
                          .toList();

                  return RefreshIndicator(
                    onRefresh: () async => {},
                    color: AppColors.primary,
                    child: IndexedStack(
                      index: selectedIndex,
                      children: [
                        _buildBookingList(
                          bookings: upcoming,
                          emptyMessage: 'Không có đặt chỗ sắp tới',
                          child: MyBookingUpcoming(bookings: upcoming),
                        ),
                        _buildBookingList(
                          bookings: completed,
                          emptyMessage: 'Không có đặt chỗ đã hoàn thành',
                          child: MyBookingCompleted(bookings: completed),
                        ),
                        _buildBookingList(
                          bookings: canceled,
                          emptyMessage: 'Không có đặt chỗ đã hủy',
                          child: MyBookingCanceled(bookings: canceled),
                        ),
                      ],
                    ),
                  );
                }

                // Unexpected state
                return const Center(  
                  child: Text(
                    'Trạng thái không xác định',
                    style: TextStyle(fontSize: 16),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBookingList({
    required List bookings,
    required String emptyMessage,
    required Widget child,
  }) {
    if (bookings.isEmpty) {
      return SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: SizedBox(
          height: MediaQuery.of(context).size.height * 0.5,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.event_busy_outlined,
                  size: 80,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  emptyMessage,
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
                const SizedBox(height: 8),
                Text(
                  'Kéo xuống để làm mới',
                  style: TextStyle(fontSize: 14, color: Colors.grey[500]),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return child;
  }
}
