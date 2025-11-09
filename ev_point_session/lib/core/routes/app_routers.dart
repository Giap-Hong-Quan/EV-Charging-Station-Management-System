import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_screen.dart';
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
      initialLocation: PathRouters.chargingSessionScreen,
      routes: [
        GoRoute(
          path: PathRouters.chargingSessionScreen,
          builder: (context, state) => const ChargingSessionScreen(),
        ),
        // GoRoute(
        //   path: PathRouters.chargingSessionScreen,
        //   builder: (_, state) => BookingScreen(
        //     station: state.extra as Station,
        //   ),
        // ),
        // GoRoute(
        //   path: PathRouters.myBookingScreen,
        //   builder: (_, __) => const MyBookingScreen(),
        // ),
        // GoRoute(
        //   path: PathRouters.mapScreen,
        //   builder: (_, __) => const MapScreen(),
        // ),
      ],
    );
    return _router!;
  }
}
