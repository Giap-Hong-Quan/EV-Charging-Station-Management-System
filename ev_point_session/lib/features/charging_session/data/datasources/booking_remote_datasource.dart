import 'dart:convert';

import 'package:ev_point_session/features/charging_session/data/models/booking_model.dart';
import 'package:http/http.dart' as http;

abstract class IBookingRemoteDatasource {
  Future<BookingModel> getBookingByBookingCode(String bookingCode);
}

class BookingRemoteDatasource implements IBookingRemoteDatasource {
  final String baseUrl;
  final http.Client client;
  BookingRemoteDatasource(this.baseUrl, this.client);

  @override
  Future<BookingModel> getBookingByBookingCode(String bookingCode) {
    final url = Uri.parse('${baseUrl}bookings/code/$bookingCode');
    print('Fetching booking from URL: $url');
    return client.get(url).then((response) {
      if (response.statusCode == 200) {
        final Map<String, dynamic> json = 
            Map<String, dynamic>.from(jsonDecode(response.body));
        return BookingModel.fromJson(json);
      } else {
        throw Exception('Failed to load booking');
      }
    });
  }
  
}
