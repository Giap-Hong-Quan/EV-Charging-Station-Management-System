
import 'package:ev_point/src/features/charging_station/data/datasources/charging_station_remote_datasource.dart';
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/domain/repositories/charging_station_repository.dart';

class ChargingStationRepositoryImpl implements IChargingStationRepository {
  final ChargingStationRemoteDataSource remoteDataSource;

  ChargingStationRepositoryImpl(this.remoteDataSource);

  @override
  Future<List<ChargingStation>> getChargingStations() async {
    return await remoteDataSource.fetchChargingiStations();
  }

  @override
  Future<ChargingStation> geChargingStationById(String stationId) async {
    return await remoteDataSource.fetchChargingStationById(stationId);
  }

  @override
  Future<List<ChargingStation>> searchChargingStation(String keyword, String connectorType) async {
    return await remoteDataSource.fetchChargingStationsBySearch(keyword, connectorType);
  }
}