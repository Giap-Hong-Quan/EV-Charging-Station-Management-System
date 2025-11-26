import 'dart:convert';

import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/data/models/charging_session_model.dart';
import 'package:http/http.dart' as http;

abstract class IchargingSessionRemoteDatasource {
  Future<ChargingSessionModel> createChargingSession(
    RequestCreateChargingSessionDto requestDto,
  );
  Future<ChargingSessionModel> endChargingSession(
    RequestEndChargingSessionDto requestDto,
  );
}

class ChargingSessionRemoteDatasourceImpl
    implements IchargingSessionRemoteDatasource {
  final String gatewayBaseUrl;

  final http.Client client;
  ChargingSessionRemoteDatasourceImpl(this.gatewayBaseUrl, this.client);

  @override
  Future<ChargingSessionModel> createChargingSession(
    RequestCreateChargingSessionDto requestDto,
  ) async {
    try {
      final uri = Uri.parse(
        '$gatewayBaseUrl/session-service/sessions/from-booking',
      );

      final response = await client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestDto.toJson()),
      );

      print("URL: $uri");
      print("Request Body: ${jsonEncode(requestDto.toJson())}");

      if (response.statusCode == 201) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        print("Response Body: $decoded");

        final sessionJson = decoded['data'] as Map<String, dynamic>;
        print("Session Json Only: $sessionJson");

        return ChargingSessionModel.fromJson(sessionJson);
      } else {
        throw Exception('Failed to create charging session');
      }
    } catch (e) {
      throw Exception('Error creating charging session: $e');
    }
  }

  @override
  Future<ChargingSessionModel> endChargingSession(
    RequestEndChargingSessionDto dto,
  ) async {
    final url = '$gatewayBaseUrl/session-service/sessions/${dto.sessionId}/end';

    final response = await client.put(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(dto.toJson()), 
    );

    print('URL: $url');
    print('Request Body: ${jsonEncode(dto.toJson())}');
    print('Status: ${response.statusCode}');
    print('Response: ${response.body}');

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      final data = decoded['data'] as Map<String, dynamic>;
      return ChargingSessionModel.fromJson(data);
    } else {
      throw Exception(
        'Failed to end charging session (status: ${response.statusCode})',
      );
    }
  }
}
