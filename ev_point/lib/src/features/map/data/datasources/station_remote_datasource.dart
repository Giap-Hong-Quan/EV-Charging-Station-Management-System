import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/station_model.dart';

abstract class StationRemoteDataSource {
  Future<List<StationModel>> fetchStations();
  Future<List<StationModel>> searchStation(
    String keyword,
    String connectorType,
  );
  Future<StationModel> getStationById(String stationId);
}

class StationRemoteDataSourceImpl implements StationRemoteDataSource {
  final http.Client client;
  final String baseUrl;
  StationRemoteDataSourceImpl(this.client, this.baseUrl);

  @override
  Future<List<StationModel>> fetchStations() async {
    final res = await client.get(
      Uri.parse('$baseUrl/stations'),
    );
    if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['stations'] as List)
        .map((e) => StationModel.fromJson(e))
        .toList();
  }

  @override
  Future<List<StationModel>> searchStation(
    String keyword,
    String connectorType,
  ) async {
    final uri = Uri.parse(
      "$baseUrl/stations/?keyword=$keyword&connectorType=$connectorType",
    );
    final res = await client.get(uri);
    if (res.statusCode != 200) throw Exception('${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return (data['stations'] as List)
        .map((e) => StationModel.fromJson(e))
        .toList();
  }

  @override
  Future<StationModel> getStationById(String stationId) async {
    final res = await client.get(
      Uri.parse('$baseUrl/stations/$stationId'),
    );
    if (res.statusCode != 200) throw Exception('HTTP ${res.statusCode}');
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return StationModel.fromJson(data);
  }
}
