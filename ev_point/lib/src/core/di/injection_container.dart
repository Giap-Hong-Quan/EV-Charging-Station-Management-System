import 'package:ev_point/src/features/booking/data/datasources/booking_datasource.dart';
import 'package:ev_point/src/features/booking/data/repositories/booking_repository_impl.dart';
import 'package:ev_point/src/features/booking/domain/repositories/ibooking_repository.dart';
import 'package:ev_point/src/features/booking/domain/usecase/create_booking.dart';
import 'package:ev_point/src/features/booking/domain/usecase/get_booking_by_user_id.dart';
import 'package:ev_point/src/features/booking/presentations/cubit/booking_cubit.dart';
import 'package:ev_point/src/features/charging_point/data/datasources/charging_point_datasoruce.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/usecase/get_charging_point_by_station_id.dart';
import 'package:ev_point/src/features/charging_point/presentations/cubit/charging_point_cubit.dart';
import 'package:ev_point/src/features/map/data/datasources/station_remote_datasource.dart';
import 'package:ev_point/src/features/map/domain/usecase/search_station.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
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

Future<void> initDependencies() async {
  final baseUrl = dotenv.env['API_STATION_BASE_URL'];
  final baseUrlChargingPoint = dotenv.env['API_EV_POINT_BASE_URL'];
  final baseUrlBooking = dotenv.env['API_BOOKING_BASE_URL'];

  sl.registerLazySingleton(() => http.Client());

  //datasource
  sl.registerLazySingleton<StationRemoteDataSource>(
    () => StationRemoteDataSourceImpl(sl(), baseUrl!),
  );
  sl.registerLazySingleton<ChargingPointRemoteDataSource>(
        () => ChargingPointRemoteDataSourceImpl(
      client: sl<http.Client>(),
      baseChargingPointUrl: baseUrlChargingPoint!,
    ),
  );
  sl.registerLazySingleton<IBookingDatasource>(
    () => BookingDatasourceImpl(
      client: sl<http.Client>(),
      baseBookingUrl: baseUrlBooking!,
    ),
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

  //usecase
  sl.registerLazySingleton(() => GetStations(sl()));
  sl.registerLazySingleton(() => SearchStation(sl()));
  sl.registerLazySingleton<GetUserLocation>(() => GetUserLocation());

  sl.registerLazySingleton(() => GetChargingPoint(sl()));
  sl.registerLazySingleton(() => GetChargingPointByStationId(sl()));

  sl.registerLazySingleton(() => CreateBooking(sl()));
  sl.registerLazySingleton(() => GetBookingByUserId(sl()));


  //cubit
  sl.registerFactory<StationCubit>(
    () => StationCubit(sl<GetStations>(), sl<SearchStation>()),
  );
  sl.registerFactory<ChargingPointCubit>(
        () => ChargingPointCubit(
      getChargingPoint: sl<GetChargingPoint>(),
          getChargingPointByStationId: sl<GetChargingPointByStationId>(),
    ),
  );

  sl.registerFactory<BookingCubit>(
    () => BookingCubit(createBookingUseCase: sl<CreateBooking>(), getBookingByUserIdUseCase: sl<GetBookingByUserId>()),
  );

  //mapbox
  final token = dotenv.env['MAPBOX_ACCESS_TOKEN'];
  if (token != null && token.isNotEmpty) {
    mb.MapboxOptions.setAccessToken(token);
  }
}
