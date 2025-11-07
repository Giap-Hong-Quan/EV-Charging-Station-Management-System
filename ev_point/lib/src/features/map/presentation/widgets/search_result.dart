import 'package:ev_point/src/features/map/presentation/cubit/station/station_cubit.dart';
import 'package:ev_point/src/features/map/presentation/widgets/search_station_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../domain/entities/station.dart';
import '../cubit/station/station_state.dart';

class SearchResult extends StatelessWidget {
  final Function(Station)? onStationTap;

  const SearchResult({
    super.key,
    this.onStationTap,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<StationCubit, StationState>(
      builder: (context, state) {
        if (state.loading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (state.stations.isEmpty) {
          return const Center(
            child: Text('No stations found'),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.stations.length,
          itemBuilder: (context, index) {
            final station = state.stations[index];
            return StationCard(
              station: station,
              onTap: onStationTap,
            );
          },
        );
      },
    );
  }
}