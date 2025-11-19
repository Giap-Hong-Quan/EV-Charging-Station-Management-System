import 'dart:convert';

import 'package:ev_point_session/features/charging_session/data/models/booking_model.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

abstract class IBookingRemoteDatasource {
  Future<BookingModel> getBookingByBookingCode(String bookingCode);
}

class BookingRemoteDatasource implements IBookingRemoteDatasource {
  final String baseUrl;
  final http.Client client;
  BookingRemoteDatasource(this.baseUrl, this.client);

  @override
  Future<BookingModel> getBookingByBookingCode(String bookingCode) async {
    final response = await client.get(
      Uri.parse('$baseUrl/bookings/code/$bookingCode'),
    );
    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      debugPrint('Full API Response: $json');
      final data = json['data'];
      if (data == null) {
        throw Exception('Booking not found');
      }
      return BookingModel.fromJson(data);
    } else {
      debugPrint('API Error: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load booking');
    }
  }
}
