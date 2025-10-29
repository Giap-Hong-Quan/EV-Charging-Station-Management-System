import 'dart:convert';

import 'package:ev_point/src/features/charging_point/data/models/charging_point_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
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
    final url = Uri.parse('$baseChargingPointUrl/points');
    final response = await client.get(url);
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((e) => ChargingPointModel.fromJson(e)).toList();
    } else {
      throw Exception(
        'Failed to load charging points (${response.statusCode})',
      );
    }
  }

  @override
  Future<List<ChargingPointModel>> getChargingPointByStationId(String stationId,) async {
    final url = Uri.parse('$baseChargingPointUrl/$stationId/points');
    final response = await client.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((e) => ChargingPointModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load charging points by station ID');
    }
  }
}
