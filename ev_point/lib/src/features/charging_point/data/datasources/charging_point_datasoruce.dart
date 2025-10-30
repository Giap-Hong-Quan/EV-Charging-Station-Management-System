import 'dart:convert';

import 'package:ev_point/src/features/charging_point/data/models/charging_point_model.dart';
import 'package:http/http.dart' as http;

abstract class ChargingPointRemoteDataSource {
  Future<List<ChargingPointModel>> fetchAllChargingPoint();
  Future<List<ChargingPointModel>> getChargingPointByStationId(
    String stationId,
  );
}

class ChargingPointRemoteDataSourceImpl
    implements ChargingPointRemoteDataSource {
  final http.Client client;
  final String baseChargingPointUrl;

  ChargingPointRemoteDataSourceImpl({
    required this.client,
    required this.baseChargingPointUrl,
  });

  @override
  Future<List<ChargingPointModel>> fetchAllChargingPoint() async {
    final res = await client.get(
      Uri.parse('$baseChargingPointUrl/points'),
    );

    if (res.statusCode != 200) {
      throw Exception('HTTP ${res.statusCode}');
    }

    // Parse thẳng list
    final data = jsonDecode(res.body) as List<dynamic>;

    return data.map((e) => ChargingPointModel.fromJson(e)).toList();
  }


 @override
  Future<List<ChargingPointModel>> getChargingPointByStationId(String stationId,) async {
    // Try query param pattern first: /points?station_id=...
    final url = Uri.parse('$baseChargingPointUrl/points?station_id=$stationId');
    final response = await client.get(url);

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);
      final List<dynamic> data = decoded is List
          ? decoded
          : (decoded is Map && decoded['data'] is List)
              ? decoded['data']
              : <dynamic>[];

      final list = data.map((e) => ChargingPointModel.fromJson(e as Map<String, dynamic>)).toList();

      // If server returned empty, fallback to local filter
      if (list.isEmpty) {
        final all = await fetchAllChargingPoint();
        return all.where((p) => p.stationId == stationId).toList();
      }

      return list;
    } else {
      // Fallback: fetch all and filter locally
      final all = await fetchAllChargingPoint();
      return all.where((p) => p.stationId == stationId).toList();
    }
  }
}
