enum PaymentMethod { cod, vnpay }

// Payment Response Model
class PaymentResponse {
  final String status;
  final String paymentUrl;
  final String paymentId;
  final String sessionId;
  final String txnRef;

  PaymentResponse({
    required this.status,
    required this.paymentUrl,
    required this.paymentId,
    required this.sessionId,
    required this.txnRef,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      status: json['status'],
      paymentUrl: json['paymentUrl'],
      paymentId: json['paymentId'],
      sessionId: json['sessionId'],
      txnRef: json['txnRef'],
    );
  }
}