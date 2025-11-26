class RequestPaymentDto {
  final String sessionId;
  final String userId;
  final String stationId;
  final double totalAmount;

  RequestPaymentDto({
    required this.sessionId,
    required this.userId,
    required this.stationId,
    required this.totalAmount,
  });
}