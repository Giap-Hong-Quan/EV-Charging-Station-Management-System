import 'package:ev_point_session/features/charging_session/domain/entities/charging_session.dart';

class ChargingSessionModel extends ChargingSession {
  ChargingSessionModel({
    required super.id,
    required super.bookingId,
    required super.sessionCode,
    required super.vehicleName,
    required super.vehicleNumber,
    required super.startTime,
    required super.endTime,
    super.durationTime,
    required super.status,
    required super.startSoCPercent,
    required super.endSoCPercent,
    required super.totalKwh,
    required super.totalAmount,
    required super.paymentMethod,
    required super.staffOperation,
    required super.createdAt,
    super.updatedAt,
  });

  factory ChargingSessionModel.fromJson(Map<String, dynamic> json) {

    final String id = json['_id']?.toString() ?? '';

    const int bookingId = 0; 

    DateTime parseDate(dynamic value, {DateTime? fallback}) {
      if (value == null) return fallback ?? DateTime.now();
      if (value is String && value.isNotEmpty) {
        return DateTime.tryParse(value) ?? (fallback ?? DateTime.now());
      }
      return fallback ?? DateTime.now();
    }

    DateTime? parseNullableDate(dynamic value) {
      if (value == null) return null;
      if (value is String && value.isNotEmpty) {
        return DateTime.tryParse(value);
      }
      return null;
    }

    return ChargingSessionModel(
      id: id,
      bookingId: bookingId,
      sessionCode: json['session_code']?.toString() ?? '',
      vehicleName: json['vehicle_name']?.toString() ?? '',
      vehicleNumber: json['vehicle_number']?.toString() ?? '',
      startTime: parseDate(json['start_time']),
      endTime: parseDate(json['end_time'], fallback: DateTime.now()),
      durationTime: null,
      status: json['status']?.toString() ?? '',
      startSoCPercent: json['start_soc_percent']?.toString() ?? '',
      endSoCPercent: json['end_soc_percent']?.toString() ?? '',
      totalKwh: (json['total_kwh'] is num)
          ? (json['total_kwh'] as num).toDouble()
          : double.tryParse(json['total_kwh']?.toString() ?? '0') ?? 0,
      totalAmount: (json['total_price'] is num)
          ? (json['total_price'] as num).toDouble()
          : double.tryParse(json['total_price']?.toString() ?? '0') ?? 0,
      paymentMethod: json['payment_method']?.toString() ?? '',
      staffOperation: json['staff_operation']?.toString() ?? '',
      createdAt: parseDate(json['createdAt']),
      updatedAt: parseNullableDate(json['updatedAt']),
    );
  }
}
