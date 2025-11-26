import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/data/dto/charging_session_active_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/charging_session_detail_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_payment_dto.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_active_screen.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_detail.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_screen.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/payment/payment_screen.dart';
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

        GoRoute(
          path: PathRouters.chargingSessionActiveScreen,
          builder: (_, state) {
            final params = state.extra as ChargingSessionActiveDto;
            return ChargingSessionActiveScreen(
              sessionId: params.sessionId,
              userId: params.userId,
              stationId: params.stationId,
              powerKWh: params.powerKWh,
              pricePerKWh: params.pricePerKWh,
              startSocPercent: 25,
              stationName: params.stationName ?? 'Unknown Station',
              pointNumber: params.pointNumber ?? 0,
              startTime: params.startTime,
            );
          },
        ),
        GoRoute(
          path: PathRouters.chargingSessionDetailsScreen,
          builder: (_, state) {
            final params = state.extra as ChargingSessionDetailDto;

            return SessionDetailPaymentScreen(
              sessionId: params.chargingSession.id,
              userId: params.userId,
              stationId: params.stationId,
              sessionCode: params.chargingSession.id,
              vehicleName: params.chargingSession.vehicleName,
              vehicleNumber: params.chargingSession.vehicleNumber,
              startTime: params.chargingSession.startTime,
              endTime: params.chargingSession.endTime,
              startSocPercent: int.parse(
                params.chargingSession.startSoCPercent,
              ),
              endSocPercent: int.parse(params.chargingSession.endSoCPercent),
              powerKWh: params.powerDelivered,
              pricePerKWh: params.chargingSession.totalAmount.toInt(),
              totalCost: params.chargingSession.totalAmount.toInt(),
              stationName: params.stationName,
              chargingPointNumber: params.pointNumber,
            );
          },
        ),

        GoRoute(
          path: PathRouters.paymentScreen,
          builder: (_, state) {
            final params = state.extra;
            if (params is! RequestPaymentDto) {
              return const Scaffold(
                body: Center(child: Text("Invalid route params")),
              );
            }

            return PaymentMethodScreen(
              sessionId: params.sessionId,
              totalAmount: params.totalAmount,
              userId: params.userId,
              stationId: params.stationId,
            );
          },
        ),
      ],
    );
    return _router!;
  }
}
