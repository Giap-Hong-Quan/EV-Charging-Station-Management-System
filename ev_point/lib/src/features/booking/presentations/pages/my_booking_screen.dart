import 'package:ev_point/src/core/utils/app_color.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/buil_tab.dart';
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
  final String userId = 'user123456'; // Example user ID
  @override
  void initState() {
    super.initState();
    context.read<BookingCubit>().getUserBookings(userId: userId);
  }

  Future<void> refreshBookings() async {
    context.read<BookingCubit>().getUserBookings(userId: userId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: const Icon(Icons.location_on, color: Colors.teal),
        title: const Text(
          'My Booking',
          style: TextStyle(
            color: AppColors.primary,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                BuildTab(
                  title: 'Upcoming',
                  isSelected: selectedIndex == 0,
                  onTap: () => setState(() => selectedIndex = 0),
                ),
                BuildTab(
                  title: 'Completed',
                  isSelected: selectedIndex == 1,
                  onTap: () => setState(() => selectedIndex = 1),
                ),
                BuildTab(
                  title: 'Canceled',
                  isSelected: selectedIndex == 2,
                  onTap: () => setState(() => selectedIndex = 2),
                ),
              ],
            ),
          ),
          Expanded(
            child: BlocBuilder<BookingCubit, BookingState>(
              builder: (context, state) {
                if (state is BookingLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is BookingError) {
                  return Center(child: Text('Error: ${state.message}'));
                }
                final allBookings = (state as BookingsLoaded).bookings;
                if (allBookings.isEmpty) {
                  return const Center(child: Text('No bookings found.'));
                }
                final upcoming =
                    allBookings.where((b) => (b.status).toUpperCase() == 'UPCOMING').toList();

                final completed =
                    allBookings.where((b) =>
                              (b.status).toUpperCase() == 'COMPLETE' ||
                              (b.status).toUpperCase() == 'COMPLETED',
                        )
                        .toList();

                final canceled =
                    allBookings
                        .where(
                          (b) => (b.status).toUpperCase() == 'CANCELED' ||
                              (b.status).toUpperCase() == 'CANCELLED',
                        )
                        .toList();
                return RefreshIndicator(
                  onRefresh: refreshBookings,
                  child: IndexedStack(
                    index: selectedIndex,
                    children: [
                      MyBookingUpcoming(bookings: upcoming),
                      MyBookingCompleted(bookings: completed),
                      MyBookingCanceled(bookings: canceled),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
