import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/features/auth/presentations/pages/login_screen.dart';
import 'package:ev_point/src/features/auth/presentations/pages/register_screen.dart';
import 'package:ev_point/src/features/booking/presentations/pages/booking_screen.dart';
import 'package:ev_point/src/features/booking/presentations/pages/my_booking_screen.dart';
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/pages/charging_station_detail_screen.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/charging_station_detail_card.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/view_charging_station.dart';
import 'package:ev_point/src/features/home/presentations/pages/home_screen.dart';
import 'package:ev_point/src/features/map/presentation/pages/map_screen.dart';
import 'package:ev_point/src/features/splash_screen/presentations/on_boarding_screen.dart';
import 'package:ev_point/src/features/splash_screen/presentations/splash_screen.dart';
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
      initialLocation: RouterPaths.splashScreen,
      routes: [
        GoRoute(
          path: RouterPaths.loginScreen,
          builder: (_, __) => const LoginScreen(),
        ),
        GoRoute(
          path: RouterPaths.registerScreen,
          builder: (_, __) => const RegisterScreen(),
        ),
        GoRoute(
          path: RouterPaths.onboardingScreen,
          builder: (_, __) => const OnboardingScreen(),
        ),
        GoRoute(
          path: RouterPaths.splashScreen,
          builder: (_, __) => const SplashScreen(),
        ),
        GoRoute(
          path: RouterPaths.homeScreen,
          builder: (_, __) => const HomeScreen(),
        ),
        GoRoute(
          path: RouterPaths.bookingScreen,
          builder: (_, state) => BookingScreen(
            station: state.extra as ChargingStation,
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
        GoRoute(
          path: RouterPaths.chargingStationDetailCard,
          builder: (_, state) => ChargingStationDetailCard(
            chargingStation: state.extra as ChargingStation,
          ),
        ),

        GoRoute(
          path: RouterPaths.chargingStationDetailsScreen,
          builder: (_, state) => ChargingStationDetailScreen(
            chargingStation: state.extra as List<ChargingStation>,
          ),
        ),  
        GoRoute(
          path: RouterPaths.viewChargingStation,
          builder: (_, state) => ViewChargingStation(
            station: state.extra as ChargingStation,
          ),
        ),
      ],
    );
    return _router!;
  }
}
