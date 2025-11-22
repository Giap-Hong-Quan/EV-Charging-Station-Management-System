import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_screen.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_start.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppRouter {
  AppRouter._();

  static final instance = AppRouter._();
  factory AppRouter() => instance;

  final navigatorKey = GlobalKey<NavigatorState>();
  GoRouter? _router;

  GoRouter createRouter() {
    if (_router != null) return _router!;

    _router = GoRouter(
      navigatorKey: navigatorKey,
      initialLocation: PathRouters.chargingSessionStartScreen,
      routes: [
        GoRoute(
          path: PathRouters.chargingSessionScreen,
          builder: (context, state) => const ChargingSessionScreen(),
        ),
        GoRoute(
          path: PathRouters.chargingSessionStartScreen,
          builder: (context, state) {
            final data = state.extra;

            String bookingCode = '';
            String vehicleName = '';
            String vehicleNumber = '';
            String timeStart = '';

            if (data != null && data is Map) {
              bookingCode = data['bookingCode']?.toString() ?? '';
              vehicleName = data['vehicleName']?.toString() ?? '';
              vehicleNumber = data['vehicleNumber']?.toString() ?? '';
              timeStart = data['timeStart']?.toString() ?? '';
            }
          

            return ChargingSessionStartScreen(
              bookingCode: bookingCode,
              vehicleName: vehicleName,
              vehicleNumber: vehicleNumber,
              timeStart: timeStart,
            );
          },
        ),
      ],
    );
    return _router!;
  }
}
