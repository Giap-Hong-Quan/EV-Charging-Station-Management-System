import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/features/booking/presentations/pages/booking_screen.dart';
import 'package:ev_point/src/features/booking/presentations/pages/my_booking_screen.dart';
import 'package:ev_point/src/features/map/domain/entities/station.dart';
import 'package:ev_point/src/features/map/presentation/pages/map_screen.dart';
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
      initialLocation: RouterPaths.mapScreen,
      routes: [
        GoRoute(
          path: RouterPaths.bookingScreen,
          builder: (_, state) => BookingScreen(
            station: state.extra as Station,
          ),
        ),
        GoRoute(
          path: RouterPaths.myBookingScreen,
          builder: (_, __) => const MyBookingScreen(),
        ),
        GoRoute(
          path: RouterPaths.mapScreen,
          builder: (_, __) => const MapScreen(),
        ),
      ],
    );
    return _router!;
  }
}
