import 'dart:convert';
import 'dart:io';

import 'package:ev_point/src/features/booking/data/models/booking_model.dart';
import 'package:http/http.dart' as http;

abstract class IBookingDatasource {
  Future<BookingModel> createBooking({
    required String userId,
    required String vehicleName,
    required String vehicleNumber,
    required String stationId,
    required String pointId,
    required DateTime scheduleStartTime,
    required DateTime scheduleEndTime,
  });

  Future<List<BookingModel>> getUserBookings({
    required String userId,
  });
  Future<BookingModel> cancelBooking({
    required String bookingId,
  });
}

class BookingDatasourceImpl implements IBookingDatasource {
  final http.Client client;
  final String baseBookingUrl;
  BookingDatasourceImpl({required this.client, required this.baseBookingUrl});
  @override
Future<BookingModel> createBooking({
  required String userId,
  required String vehicleName,
  required String vehicleNumber,
  required String stationId,
  required String pointId,
  required DateTime scheduleStartTime,
  required DateTime scheduleEndTime,
}) async {
  final response = await client.post(
    Uri.parse('$baseBookingUrl/bookings'),
    headers: {HttpHeaders.contentTypeHeader: 'application/json'},
    body: jsonEncode({
      'user_id': userId,
      'vehicle_name': vehicleName,
      'vehicle_number': vehicleNumber,
      'station_id': stationId,
      'point_id': pointId,
      'schedule_start_time': scheduleStartTime.toIso8601String(),
      'schedule_end_time': scheduleEndTime.toIso8601String(),
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

  @override
  Future<List<BookingModel>> getUserBookings({required String userId}) async {
    final response = await client.get(
      Uri.parse('$baseBookingUrl/bookings/user/$userId'),
      headers: {HttpHeaders.contentTypeHeader: 'application/json'},
    );
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      final data = decoded['data'] as List;
      return data.map((bookingJson) => BookingModel.fromJson(bookingJson)).toList();
    } else if (response.statusCode == 400) {
      final decoded = jsonDecode(response.body);
      throw Exception('Bad request: ${decoded['message'] ?? 'Invalid data'}');
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized');
    } else {
      throw Exception('Failed to fetch user bookings: ${response.statusCode}');
    }
  }
  
  @override
  Future<BookingModel> cancelBooking({required String bookingId}) async {
    final response = await client.post(
      Uri.parse('$baseBookingUrl/bookings/cancel'),
      headers: {HttpHeaders.contentTypeHeader: 'application/json'},
      body: jsonEncode({'booking_id': bookingId}),
    );
    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      final data = decoded['data'];
      return BookingModel.fromJson(data);
    } else if (response.statusCode == 400) {
      final decoded = jsonDecode(response.body);
      throw Exception('Bad request: ${decoded['message'] ?? 'Invalid data'}');
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized');
    } else {
      throw Exception('Failed to cancel booking: ${response.statusCode}');
    }
  }
}
