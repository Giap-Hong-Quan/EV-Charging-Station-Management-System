import 'package:dio/dio.dart';
import 'package:ev_point/src/core/network/auth_interceptor.dart';
import 'package:ev_point/src/features/auth/data/datasources/auth_local_datasources.dart';
import 'package:ev_point/src/features/auth/data/datasources/user_remote_datasources.dart';
import 'package:ev_point/src/features/auth/data/repositories/user_repository_impl.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/features/auth/domain/usecase/get_current_profile_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/login_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/register_user.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_cubit.dart';
import 'package:ev_point/src/features/booking/data/datasources/booking_datasource.dart';
import 'package:ev_point/src/features/booking/data/repositories/booking_repository_impl.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';
import 'package:ev_point/src/features/booking/domain/usecase/cancel_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/create_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/get_booking_by_user_id.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/charging_point/data/datasources/charging_point_datasoruce.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_id.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_station_id.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';
import 'package:ev_point/src/features/charging_station/data/datasources/charging_station_remote_datasource.dart';
import 'package:ev_point/src/features/charging_station/data/repositories/charging_station_repository_impl.dart';
import 'package:ev_point/src/features/charging_station/domain/repositories/charging_station_repository.dart';
import 'package:ev_point/src/features/charging_station/domain/usecase/get_charging_station_by_id.dart';
import 'package:ev_point/src/features/charging_station/domain/usecase/get_charging_stations.dart';
import 'package:ev_point/src/features/charging_station/domain/usecase/search_charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_cubit.dart';
import 'package:ev_point/src/features/map/data/datasources/station_remote_datasource.dart';
import 'package:ev_point/src/features/map/domain/usecase/get_station_by_id.dart';
import 'package:ev_point/src/features/map/domain/usecase/search_station.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../features/charging_point/data/repositories/charging_point_impl.dart';
import '../../features/map/data/repositories/station_repository_impl.dart';
import '../../features/map/domain/repositories/station_repository.dart';
import '../../features/map/domain/usecase/get_stations.dart';
import '../../features/map/domain/usecase/get_user_location.dart';
import '../../features/map/presentation/cubit/station/station_cubit.dart';

final sl = GetIt.instance;
Dio dioConfig(String baseUrl) {
  return Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 12),
        headers: {'Content-Type': 'application/json'},
      ),
    )
    ..interceptors.add(
      LogInterceptor(
        request: true,
        requestBody: true,
        responseBody: true,
        error: true,
      ),
    );
}

Future<void> initDependencies() async {
  final baseUrlGetway = dotenv.env['API_GETWAY_BASE_URL'];

  sl.registerLazySingleton(() => http.Client());

  sl.registerLazySingleton<FlutterSecureStorage>(() => const FlutterSecureStorage());

    sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl<FlutterSecureStorage>()),
  );


  sl.registerLazySingleton<Dio>(() {
    final dio = dioConfig(baseUrlGetway!);
    dio.interceptors.add(
      AuthInterceptor(
        localDataSource: sl<AuthLocalDataSource>(),
      ),
    );
    return dio;
  });


  //datasource
  sl.registerLazySingleton<StationRemoteDataSource>(
    () => StationRemoteDataSourceImpl(sl(), baseUrlGetway!),
  );
  sl.registerLazySingleton<ChargingPointRemoteDataSource>(
    () => ChargingPointRemoteDataSourceImpl(
      client: sl<http.Client>(),
      baseChargingPointUrl: baseUrlGetway!,
    ),
  );
  sl.registerLazySingleton<IBookingDatasource>(
    () => BookingDatasourceImpl(
      client: sl<http.Client>(),
      gatewayUrl: baseUrlGetway!,
    ),
  );
  sl.registerLazySingleton<ChargingStationRemoteDataSource>(
    () => ChargingStationRemoteDataSourceImpl(
      client: sl<http.Client>(),
      baseChargingStationUrl: baseUrlGetway!,
    ),
  );
  sl.registerLazySingleton<UserRemoteDatasources>(
    () => UserRemoteDatasourcesImpl(dio: sl<Dio>(), gatewayUrl: baseUrlGetway!),
  );



  //Repo
  sl.registerLazySingleton<StationRepository>(
    () => StationRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<IChargingPointRepository>(
    () => ChargingPointRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<IBookingRepository>(
    () => BookingRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<IChargingStationRepository>(
    () => ChargingStationRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<IUserRepository>(
    () => UserRepositoryImpl(
      sl<UserRemoteDatasources>(),
      sl<AuthLocalDataSource>(),
    ),
  );

  //usecase
  sl.registerLazySingleton(() => GetStations(sl()));
  sl.registerLazySingleton(() => SearchStation(sl()));
  sl.registerLazySingleton(() => GetStationById(sl()));
  sl.registerLazySingleton<GetUserLocation>(() => GetUserLocation());

  sl.registerLazySingleton(() => GetChargingPoint(sl()));
  sl.registerLazySingleton(() => GetChargingPointByStationId(sl()));
  sl.registerLazySingleton(() => GetChargingPointById(sl()));

  sl.registerLazySingleton(() => CreateBooking(sl()));
  sl.registerLazySingleton(() => GetBookingByUserId(sl()));
  sl.registerLazySingleton(() => CancelBooking(sl()));

  sl.registerLazySingleton(() => GetChargingStations(sl()));
  sl.registerLazySingleton(() => GetChargingStationById(sl()));
  sl.registerLazySingleton(() => SearchChargingStation(sl()));

  sl.registerLazySingleton(() => RegisterUserUC(sl()));
  sl.registerLazySingleton(() => LoginUserUC(sl()));
  sl.registerLazySingleton(() => GetCurrentProfileUserUC(sl()));

  //cubit
  sl.registerFactory<StationCubit>(
    () => StationCubit(sl<GetStations>(), sl<SearchStation>()),
  );
  sl.registerFactory<ChargingPointCubit>(
    () => ChargingPointCubit(
      getChargingPointUseCase: sl<GetChargingPoint>(),
      getChargingPointByStationIdUseCase: sl<GetChargingPointByStationId>(),
      getChargingPointByIdUseCase: sl<GetChargingPointById>(),
    ),
  );

  sl.registerFactory<BookingCubit>(
    () => BookingCubit(
      createBookingUseCase: sl<CreateBooking>(),
      getBookingByUserIdUseCase: sl<GetBookingByUserId>(),
      getChargingPointByIdUseCase: sl<GetChargingPointById>(),
      getStationByIdUseCase: sl<GetStationById>(),
      cancelBookingUseCase: sl<CancelBooking>(),
    ),
  );

  sl.registerFactory<ChargingStationCubit>(
    () => ChargingStationCubit(
      getChargingStationByIdUC: sl<GetChargingStationById>(),
      getChargingStationsUC: sl<GetChargingStations>(),
      searchChargingStationUC: sl<SearchChargingStation>(),
    ),
  );

  sl.registerFactory<UserCubit>(
    () => UserCubit(
      registerUserUC: sl<RegisterUserUC>(),
      loginUserUC: sl<LoginUserUC>(),
      getCurrentProfileUserUC: sl<GetCurrentProfileUserUC>(),
      userRepository: sl<IUserRepository>(),
    ),
  );

  //mapbox
  final token = dotenv.env['MAPBOX_ACCESS_TOKEN'];
  if (token != null && token.isNotEmpty) {
    mb.MapboxOptions.setAccessToken(token);
  }
}
