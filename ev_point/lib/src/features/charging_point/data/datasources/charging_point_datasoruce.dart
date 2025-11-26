import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:ev_point/src/features/charging_point/data/models/charging_point_model.dart';

abstract class ChargingPointRemoteDataSource {
  Future<List<ChargingPointModel>> fetchAllChargingPoint();
  Future<List<ChargingPointModel>> getChargingPointByStationId(
    String stationId,
  );
  Future<ChargingPointModel> getChargingPointById(String chargingPointId);
  Future<ChargingPointModel> patchStatusChargingPoint(
    String chargingPointId,
    String pointStatus,
  );
}

class ChargingPointRemoteDataSourceImpl
    implements ChargingPointRemoteDataSource {
  final Dio dio;
  final String baseGatewayUrl;

  ChargingPointRemoteDataSourceImpl({
    required this.dio,
    required this.baseGatewayUrl,
  });

  /// GET {baseGatewayUrl}/points
  @override
  Future<List<ChargingPointModel>> fetchAllChargingPoint() async {
    final res = await dio.get('$baseGatewayUrl/station-service/points');

    if (res.statusCode != 200) {
      throw Exception('HTTP ${res.statusCode} khi fetchAllChargingPoint');
    }

    final dynamic raw = res.data;
    final dynamic decoded = raw is String ? jsonDecode(raw) : raw;

    if (decoded is! List) {
      throw Exception('Dữ liệu trả về không phải List');
    }

    return decoded
        .map((e) => ChargingPointModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET {baseGatewayUrl}/points/{stationId}/points
  @override
  Future<List<ChargingPointModel>> getChargingPointByStationId(
    String stationId,
  ) async {
    try {
      final res = await dio.get(
        '$baseGatewayUrl/station-service/points/$stationId/points',
      );

      if (res.statusCode == 200) {
        final dynamic raw = res.data;
        final dynamic decoded = raw is String ? jsonDecode(raw) : raw;

        final List<dynamic> data =
            decoded is List
                ? decoded
                : (decoded is Map && decoded['data'] is List)
                ? decoded['data'] as List
                : <dynamic>[];

        final list =
            data
                .map(
                  (e) => ChargingPointModel.fromJson(e as Map<String, dynamic>),
                )
                .toList();

        if (list.isEmpty) {
          final all = await fetchAllChargingPoint();
          return all.where((p) => p.stationId == stationId).toList();
        }

        return list;
      } else {
        final all = await fetchAllChargingPoint();
        return all.where((p) => p.stationId == stationId).toList();
      }
    } on DioException {
      final all = await fetchAllChargingPoint();
      return all.where((p) => p.stationId == stationId).toList();
    }
  }

  /// GET {baseGatewayUrl}/points/{chargingPointId}
  @override
  Future<ChargingPointModel> getChargingPointById(
    String chargingPointId,
  ) async {
    final res = await dio.get(
      '$baseGatewayUrl/station-service/points/$chargingPointId',
    );

    if (res.statusCode == 200) {
      final dynamic raw = res.data;
      final dynamic decoded = raw is String ? jsonDecode(raw) : raw;

      if (decoded is! Map<String, dynamic>) {
        throw Exception('Dữ liệu trả về không phải Map');
      }

      final Map<String, dynamic> jsonMap =
          decoded['data'] is Map<String, dynamic>
              ? decoded['data'] as Map<String, dynamic>
              : decoded;

      return ChargingPointModel.fromJson(jsonMap);
    } else {
      throw Exception('Failed to load charging point (HTTP ${res.statusCode})');
    }
  }

  @override
  Future<ChargingPointModel> patchStatusChargingPoint(
    String chargingPointId,
    String pointStatus,
  ) async {
    try {
      final res = await dio.patch(
        '$baseGatewayUrl/station-service/points/$chargingPointId/status',
        data: {'point_status': pointStatus},
        options: Options(headers: {'Content-Type': 'application/json'}),
      );

      if (res.statusCode == 200) {
        final dynamic raw = res.data;
        final dynamic decoded = raw is String ? jsonDecode(raw) : raw;

        final Map<String, dynamic> jsonMap =
            decoded['data'] is Map<String, dynamic>
                ? decoded['data'] as Map<String, dynamic>
                : decoded;

        return ChargingPointModel.fromJson(jsonMap);
      } else {
        throw Exception(
          'Failed to patch charging point status (HTTP ${res.statusCode})',
        );
      }
    } on DioException catch (e) {
      throw Exception('DioException: ${e.message}');
    }
  }
}
