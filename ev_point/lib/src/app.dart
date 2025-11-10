import 'package:ev_point/src/core/routes/app_routers.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import 'features/map/presentation/cubit/station/station_cubit.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => GetIt.I<StationCubit>()..load()),
        BlocProvider(create: (_) => GetIt.I<ChargingPointCubit>()),
        BlocProvider(create: (_) => GetIt.I<BookingCubit>()),
      ],
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        title: 'EV Point',
        routerConfig: AppRouter().createRouter(),
      ),
    );
  }
}
