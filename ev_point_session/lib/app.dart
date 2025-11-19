import 'package:ev_point_session/core/routes/app_routers.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
       BlocProvider(create:   (_) => GetIt.I<ChargingSessionCubit>()),
      ],
      child: MaterialApp.router(
        debugShowCheckedModeBanner: false,
        title: 'EV Point',
        routerConfig: AppRouter().createRouter(),
      ),
    );
  }
}