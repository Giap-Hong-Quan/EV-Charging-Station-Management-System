import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';

class BookingModel extends Booking {
  BookingModel({
    required super.id,
    required super.bookingCode,
    required super.userId,
    required super.stationId,
    required super.pointId,
    required super.vehicleName,
    required super.vehicleNumber,
    required super.scheduleStartTime,
    required super.scheduleEndTime,
    super.holdExpireAt,
    required super.status,
    super.cancelledAt,
  });

  
  factory BookingModel.fromJson(Map<String, dynamic> json) {
    int parseId(dynamic value) {
        if (value == null) return 0;
        if (value is int) return value;
        if (value is String) return int.tryParse(value) ?? 0;
        return 0;
      }
      DateTime? parseDateTime(dynamic value) {
        if (value == null || value.toString().isEmpty) return null;
        try {
          return DateTime.parse(value.toString());
        } catch (e) {
          return null;
        }
      }
    return BookingModel(
      id: parseId(json['id']),
        bookingCode: json['booking_code']?.toString() ?? '',
        userId: json['user_id']?.toString() ?? '',
        stationId: json['station_id']?.toString() ?? '',
        pointId: json['point_id']?.toString() ?? '',
        vehicleName: json['vehicle_name']?.toString() ?? '',
        vehicleNumber: json['vehicle_number']?.toString() ?? '',
        scheduleStartTime: parseDateTime(json['schedule_start_time']),
        scheduleEndTime: parseDateTime(json['schedule_end_time']),
        holdExpireAt: json['hold_expires_at']?.toString(),
        status: json['status']?.toString() ?? '',
        cancelledAt: parseDateTime(json['cancelled_at']),
      );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_code': bookingCode,
      'user_id': userId,
      'station_id': stationId,
      'point_id': pointId,
      'vehicle_name': vehicleName,
      'vehicle_number': vehicleNumber,
      'schedule_start_time': scheduleStartTime?.toIso8601String(),
      'schedule_end_time': scheduleEndTime?.toIso8601String(),
      'hold_expires_at': holdExpireAt,
      'status': status,
      'cancelled_at': cancelledAt?.toIso8601String(),
    };
  }

  //parse tu qr String
 factory BookingModel.fromQRString(String qrString) {
  final Map<String, String> data = {};
  final lines = qrString.split('\n');

  for (var line in lines) {
    final parts = line.split(':');
    if (parts.length >= 2) {
      final key = parts[0].trim();
      final value = parts.sublist(1).join(':').trim();
      data[key] = value;
    }
  }

  // Parse datetime từ Date + Time
  DateTime? parseScheduleStart() {
    final date = data['Date'];
    final time = data['TimeStart'] ?? data['Time'];
    if (date == null || time == null) return null;

    final combined = "$date $time"; // ví dụ: "Nov 10, 2025 14:00"

    try {
      return DateTime.parse(
        DateTime.tryParse(combined) != null
            ? combined
            : _convertToISODate(combined),
      );
    } catch (_) {
      return null;
    }
  }

  return BookingModel(
    id: int.tryParse(data['BookingId'] ?? '0') ?? 0,
    bookingCode: data['BookingCode'] ?? '',
    userId: '',
    stationId: '',
    pointId: data['Point Number'] ?? '',
    vehicleName: data['vehicle Name'] ?? '',         
    vehicleNumber: data['vehicle_number'] ?? '',      // QR không có => để rỗng
    scheduleStartTime: parseScheduleStart(),
    scheduleEndTime: null,
    holdExpireAt: null,
    status: '',
    cancelledAt: null,
  );
}

// Hàm convert "Nov 10, 2025 14:00" → "2025-11-10 14:00"
static String _convertToISODate(String dateString) {
  final months = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };

  final parts = dateString.split(' ');
  final month = months[parts[0]]!;
  final day = parts[1].replaceAll(',', '');
  final year = parts[2];
  final time = parts[3];

  return "$year-${month.toString().padLeft(2, '0')}-${day.padLeft(2,'0')} $time";
}

}