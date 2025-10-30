import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_state.dart';
import 'package:ev_point/src/features/map/domain/entities/station.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChargingPointData extends StatefulWidget {
  final Station station;
  const ChargingPointData({super.key, required this.station});

  @override
  State<ChargingPointData> createState() => _ChargingPointDataState();
}

class _ChargingPointDataState extends State<ChargingPointData> {
  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(covariant ChargingPointData oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.station.id != widget.station.id) {
      _load();
    }
  }

  void _load() {
    context.read<ChargingPointCubit>().loadAllChargingPoint();
  }

  // ...existing code...
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ChargingPointCubit, ChargingPointState>(
      builder: (context, state) {
        if (state is ChargingPointLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is ChargingPointLoaded) {
          final chargingPoints = state.chargingPoints;
          if (chargingPoints.isEmpty) {
            return const Center(
              child: Text('Không có point nào trong trạm này'),
            );
          }
          return Material(
            child: ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: chargingPoints.length,
              itemBuilder: (context, index) {
                final point = chargingPoints[index];
                return ListTile(
                  title: Text('Point ${point.pointNumber}'),
                  subtitle: Text('Status: ${point.pointStatus}'),
                );
              },
            ),
          );
        } else if (state is ChargingPointError) {
          return Center(child: Text('Error: ${state.message}'));
        } else {
          return const Center(child: Text('No data available'));
        }
      },
    );
  }

  // ...existing code...
}
