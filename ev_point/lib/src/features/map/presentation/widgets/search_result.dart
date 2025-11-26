// import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
// import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_cubit.dart';
// import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_state.dart';
// import 'package:ev_point/src/features/map/presentation/widgets/search_station_card.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';


// class SearchResult extends StatelessWidget {
//   final Function(ChargingStation)? onStationTap;

//   const SearchResult({
//     super.key,
//     this.onStationTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return BlocBuilder<ChargingStationCubit, ChargingStationState>(
//       builder: (context, state) {
//         if (state is ChargingStationLoading) {
//           return const Center(
//             child: CircularProgressIndicator(),
//           );
//         }

//         if (state is ChargingStationError) {
//           return const Center(
//             child: Text('No stations found'),
//           );
//         }

//         return ListView.builder(
//           padding: const EdgeInsets.all(16),
//           itemCount: state.props.length,
//           itemBuilder: (context, index) {
//             final station = state.props[index];
//             return StationCard(
//               station: station,
//               onTap: onStationTap,
//             );
//           },
//         );
//       },
//     );
//   }
// }