import 'dart:convert';

import 'package:ev_point/src/features/charging_station/data/models/charging_stations_model.dart';
import 'package:http/http.dart' as http;

abstract class ChargingStationRemoteDataSource {
  Future<List<ChargingStationsModel>> fetchChargingiStations();
  Future<ChargingStationsModel> fetchChargingStationById(String stationId);
  Future<List<ChargingStationsModel>> fetchChargingStationsBySearch(
    String keyword,
    String connectorType,
  );
}

class ChargingStationRemoteDataSourceImpl
    implements ChargingStationRemoteDataSource {
  final http.Client client;
  final String baseChargingStationUrl;
  ChargingStationRemoteDataSourceImpl({required this.client, required this.baseChargingStationUrl});
  @override
  Future<List<ChargingStationsModel>> fetchChargingiStations() async {
    final res = await client.get(
      Uri.parse('$baseChargingStationUrl/station-service/stations'),
    );
    if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['stations'] as List)
        .map((e) => ChargingStationsModel.fromJson(e))
        .toList();
  }

  @override
  Future<ChargingStationsModel> fetchChargingStationById(String stationId) async {
    final res = await client.get(
      Uri.parse('$baseChargingStationUrl/station-service/stations/$stationId'),
    );
    if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return ChargingStationsModel.fromJson(data);
  }

  @override
  Future<List<ChargingStationsModel>> fetchChargingStationsBySearch(
    String keyword,
    String connectorType,
  ) async {
    final uri = Uri.parse(
      "$baseChargingStationUrl/station-service/stations/?keyword=$keyword&connectorType=$connectorType",
    );
    final res = await client.get(uri);
    if (res.statusCode != 200) throw Exception('${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['stations'] as List)
        .map((e) => ChargingStationsModel.fromJson(e))
        .toList();
  }
}
