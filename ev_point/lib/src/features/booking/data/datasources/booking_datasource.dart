import 'dart:convert';
import 'dart:io';

import 'package:ev_point/src/features/booking/data/models/booking_model.dart';
import 'package:http/http.dart' as http;

abstract class IBookingDatasource {
  Future<BookingModel> createBooking({
    required String userId,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  });
}

class BookingDatasourceImpl implements IBookingDatasource {
  final http.Client client;
  final String baseBookingUrl;
  BookingDatasourceImpl({required this.client, required this.baseBookingUrl});
  @override
  Future<BookingModel> createBooking({
    required String userId,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  }) async {
    print('POST URL: $baseBookingUrl/bookings');
    final response = await client.post(
      Uri.parse('$baseBookingUrl/bookings'),
      headers: {HttpHeaders.contentTypeHeader: 'application/json'},
      body: jsonEncode({
        'userId': userId,
        'stationId': stationId,
        'pointId': pointId,
        'scheduleStartTime': scheduleStartTime.toIso8601String(),
        'scheduleEndTime': scheduleEndTime.toIso8601String(),
      }),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      final decoded = jsonDecode(response.body);
      final data = decoded['data'];

      final bookingJson = data is List ? data.first : data;
      return BookingModel.fromJson(bookingJson as Map<String, dynamic>);
    } else if (response.statusCode == 400) {
      final decoded = jsonDecode(response.body);
      throw Exception('Bad request: ${decoded['message'] ?? 'Invalid data'}');
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized');
    } else {
      throw Exception('Failed to create booking: ${response.statusCode}');
    }
  }
}
