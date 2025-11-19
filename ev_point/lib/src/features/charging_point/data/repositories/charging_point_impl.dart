import 'package:ev_point/src/features/charging_point/data/datasources/charging_point_datasoruce.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import 'package:ev_point/src/features/charging_point/domain/repositories/charging_point_repository.dart';

class ChargingPointRepositoryImpl implements IChargingPointRepository{
  final ChargingPointRemoteDataSource chargingPointRemoteDataSource;
  ChargingPointRepositoryImpl(this.chargingPointRemoteDataSource);
  @override
  Future<List<ChargingPoint>> getAllChargingPoint() => chargingPointRemoteDataSource.fetchAllChargingPoint();

  @override
  Future<List<ChargingPoint>> getChargingPointByStationId(String stationId) => chargingPointRemoteDataSource.getChargingPointByStationId(stationId);
  
  @override
  Future<ChargingPoint> getChargingPointById(String chargingPointId) => chargingPointRemoteDataSource.getChargingPointById(chargingPointId);
  
}