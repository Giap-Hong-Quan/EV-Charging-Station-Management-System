import 'package:ev_point_session/features/charging_session/data/datasources/booking_remote_datasource.dart';
import 'package:ev_point_session/features/charging_session/data/datasources/charging_session_remote_datasource.dart';
import 'package:ev_point_session/features/charging_session/data/repositories/booking_repository_impl.dart';
import 'package:ev_point_session/features/charging_session/data/repositories/charging_session_repository_impl.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/ibooking_repository.dart';
import 'package:ev_point_session/features/charging_session/domain/repositories/icharging_session_repository.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/create_charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/end_charging_session.dart';
import 'package:ev_point_session/features/charging_session/domain/usecase/get_booking_by_booking_code.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;

final sl = GetIt.instance;

Future<void> initDependencies() async {
  final gatewayBaseUrl = dotenv.env['API_GATEWAY_BASE_URL'];
  sl.registerLazySingleton(() => http.Client());

  // Datasources
  sl.registerLazySingleton<IBookingRemoteDatasource>(
    () => BookingRemoteDatasource(gatewayBaseUrl!, sl()),
  );
  sl.registerLazySingleton<IchargingSessionRemoteDatasource>(
    () => ChargingSessionRemoteDatasourceImpl(gatewayBaseUrl!, sl()),
  );

  // Repositories
  sl.registerLazySingleton<IbookingRepository>(
    () => BookingRepositoryImpl(sl<IBookingRemoteDatasource>()),
  );
  sl.registerLazySingleton<IchargingSessionRepository>(
    () => ChargingSessionRepositoryImpl(sl<IchargingSessionRemoteDatasource>()),
  );

  // Usecases
  sl.registerLazySingleton<GetBookingByBookingCode>(
    () => GetBookingByBookingCode(sl<IbookingRepository>()),
  );
  sl.registerLazySingleton<CreateChargingSessionUC>(
    () => CreateChargingSessionUC(sl<IchargingSessionRepository>()),
  );

  sl.registerLazySingleton<EndChargingSessionUseCase>(
    () => EndChargingSessionUseCase(sl<IchargingSessionRepository>()),
  );

  // Cubits
  sl.registerFactory(
    () => ChargingSessionCubit(
      sl<GetBookingByBookingCode>(),
      sl<CreateChargingSessionUC>(),
      sl<EndChargingSessionUseCase>(),
    ),
  );
}
