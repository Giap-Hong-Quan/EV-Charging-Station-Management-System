import 'package:ev_point/src/core/utils/format_date_time.dart';
import 'package:ev_point/src/features/booking/domain/entities/booking.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/my_booking_widgets/card/canceled_booking_card.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_id.dart';
import 'package:ev_point/src/features/map/domain/entities/station.dart';
import 'package:ev_point/src/features/map/domain/usecase/get_station_by_id.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class MyBookingCanceled extends StatelessWidget {
  final List<Booking> bookings;
  const MyBookingCanceled({super.key, required this.bookings});

  @override
  Widget build(BuildContext context) {
    if (bookings.isEmpty) {
      return Center(
        child: Text(
          'Không có lịch đặt đã hủy',
          style: TextStyle(color: Colors.grey[600]),
        ),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
      itemCount: bookings.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, i) {
        final b = bookings[i];
        final getStationByIdUC = context.read<GetStationById>();
        final getChargingPointByIdUC = context.read<GetChargingPointById>();

        return FutureBuilder<Map<String, dynamic>>(
          future: _fetchStationAndPoint(
            getStationByIdUC,
            getChargingPointByIdUC,
            b.stationId,
            b.pointId,
          ),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Center(child: CircularProgressIndicator()),
                ),
              );
            }

            if (snapshot.hasError || !snapshot.hasData) {
              return _buildFallbackCard(b);
            }

            final data = snapshot.data!;
            final station = data['station'] as Station?;
            final point = data['point'] as ChargingPoint?;

            if (station == null) {
              return _buildFallbackCard(b);
            }

            return _buildBookingCard(b, station, point);
          },
        );
      },
    );
  }

  Future<Map<String, dynamic>> _fetchStationAndPoint(
    GetStationById getStation,
    GetChargingPointById getPoint,
    String stationId,
    String pointId,
  ) async {
    try {
      final results = await Future.wait([
        getStation(stationId),
        getPoint(pointId),
      ]);

      return {
        'station': results[0] as Station?,
        'point': results[1] as ChargingPoint?,
      };
    } catch (e) {
      return {
        'station': null,
        'point': null,
      };
    }
  }

  Widget _buildBookingCard(Booking b, Station station, ChargingPoint? point) {
    final start = b.scheduleStartTime;
    final canceledAt = b.cancelledAt;

    final date = '${mm(start.month)} ${dd(start.day)}, ${start.year}';

    final canceledTime = '${hh2(canceledAt!.hour)}:${hh2(canceledAt.minute)}';
    final timeBooking = '${hh2(start.hour)}:${hh2(start.minute)}';


    return CanceledBookingCard(
      date: date,
      timeCancelled: canceledTime,
      timeBooking: timeBooking,
      name: station.name,
      address: station.address,
      power: '${station.powerKw} kW',
      chargingPoint: point?.pointNumber.toString() ?? 'N/A',
    );
  }

  Widget _buildFallbackCard(Booking b) {
    final start = b.scheduleStartTime;

    final date = '${mm(start.month)} ${dd(start.day)}, ${start.year}';

    
    return CanceledBookingCard(
      date: date,
      timeCancelled: '',
      timeBooking: '',
      name: 'Unknown Station',
      address: '',
      power: 'N/A',
      chargingPoint: 'N/A',
    );
  }

  
}