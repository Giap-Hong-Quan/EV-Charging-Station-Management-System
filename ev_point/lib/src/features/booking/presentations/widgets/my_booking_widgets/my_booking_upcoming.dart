import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:ev_point/src/core/utils/format_date_time.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/card/up_coming_booking_card.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_state.dart';

import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_cubit.dart';

import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';

class MyBookingUpcoming extends StatefulWidget {
  final List<Booking> bookings;
  const MyBookingUpcoming({super.key, required this.bookings});

  @override
  State<MyBookingUpcoming> createState() => _MyBookingUpcomingState();
}

class _MyBookingUpcomingState extends State<MyBookingUpcoming> {
  late final Map<String, Future<Map<String, dynamic>>> _futureDetails;

  @override
  void initState() {
    super.initState();
    final stationCubit = context.read<ChargingStationCubit>();
    final pointCubit = context.read<ChargingPointCubit>();

    _futureDetails = {
      for (final b in widget.bookings)
        b.id.toString(): _getStationAndPoint(stationCubit, pointCubit, b.stationId, b.pointId),
    };
  }

  Future<Map<String, dynamic>> _getStationAndPoint(
    ChargingStationCubit stationCubit,
    ChargingPointCubit pointCubit,
    String stationId,
    String pointId,
  ) async {
    try {
      final results = await Future.wait([
        stationCubit.getChargingStationByIdUC(stationId),
        pointCubit.getChargingPointByIdUseCase(pointId),
      ]);

      return {
        "station": results[0] as ChargingStation?,
        "point": results[1] as ChargingPoint?,
      };
    } catch (_) {
      return {"station": null, "point": null};
    }
  }


  void _cancelBooking(BuildContext context, Booking booking) {
    context.read<BookingCubit>().cancelBooking(bookingId: booking.id.toString());
  }

  @override
  Widget build(BuildContext context) {
    if (widget.bookings.isEmpty) {
      return Center(
        child: Text(
          "Không có đặt chỗ sắp tới",
          style: TextStyle(color: Colors.grey.shade600),
        ),
      );
    }

    return BlocListener<BookingCubit, BookingState>(
      listener: (context, state) {
        print("BookingCubit State Changed: $state");
        if (state is BookingCancelled) {
          final canceledBooking = state.booking;
          context.read<ChargingPointCubit>().updateChargingPointStatus(
                chargingPointId: canceledBooking.pointId,
                status: 'Empty',
              );

           context
          .read<BookingCubit>()
          .getUserBookings(userId: canceledBooking.userId);

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Hủy đặt chỗ thành công!"),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
            ),
          );
        } else if (state is BookingError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Lỗi: ${state.message}"),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      },
      child: ListView.separated(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        itemCount: widget.bookings.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final b = widget.bookings[index];

          final start = b.scheduleStartTime;
          final date = "${mm(start.month)} ${dd(start.day)}, ${start.year}";
          final time = "${hh2(start.hour)}:${hh2(start.minute)}";

          return FutureBuilder<Map<String, dynamic>>(
            future: _futureDetails[b.id.toString()],
            builder: (context, snapshot) {
              final station = snapshot.data?["station"] as ChargingStation?;
              final point = snapshot.data?["point"] as ChargingPoint?;

              final stationName = station?.name ?? "Unknown Station";
              final stationAddr = station?.address ?? "";
              final stationPower = station?.powerKw ?? 0;
              final pointNumber = point?.pointNumber ?? 0;

              return UpComingBookingCard(
                bookingId: b.id.toString(),
                userId: b.userId,
                stationId: b.stationId,
                date: date,
                time: time,
                name: stationName,
                bookingCode: b.bookingCode,
                vehicalName: b.vehicleName,
                vehialNumber: b.vehicleNumber,
                address: stationAddr,
                powerKw: stationPower,
                pricePerKwh:  station?.pricePerKwh ?? 0,
                timeStart: time,
                pointNumber: pointNumber,
                chargingPointId: b.pointId,
                hasReminder: false,

                onCancelPressed: () => _cancelBooking(context, b),
              );
            },
          );
        },
      ),
    );
  }
}
