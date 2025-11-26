class RequestEndChargingSessionDto {
  final String sessionId;     
  final int endSocPercent;  
  final double totalKwh;     
  final int totalPrice;      

  RequestEndChargingSessionDto({
    required this.sessionId,
    required this.endSocPercent,
    required this.totalKwh,
    required this.totalPrice,
  });

  Map<String, dynamic> toJson() {
    return {
      'end_soc_percent': endSocPercent,
      'total_kwh': totalKwh,
      'total_price': totalPrice,
    };
  }

  @override
  String toString() {
    return 'RequestEndChargingSessionDto(sessionId: $sessionId, endSocPercent: $endSocPercent, totalKwh: $totalKwh, totalPrice: $totalPrice)';
  }
}
