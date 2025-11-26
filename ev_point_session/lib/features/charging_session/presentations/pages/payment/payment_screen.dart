import 'package:ev_point_session/features/charging_session/data/dto/payment_response.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentMethodScreen extends StatefulWidget {
  final String sessionId;
  final String stationId;
  final String userId;
  final double totalAmount;
  final String? paymentMethod;

  const PaymentMethodScreen({
    super.key,
    required this.sessionId,
    required this.userId,
    required this.stationId,
    required this.totalAmount,
    this.paymentMethod = 'VNPAY',
  });

  @override
  State<PaymentMethodScreen> createState() => _PaymentMethodScreenState();
}

class _PaymentMethodScreenState extends State<PaymentMethodScreen> {
  PaymentMethod? _selectedMethod;
  bool _isProcessing = false;

  String _formatCurrency(double amount) {
    return NumberFormat('#,###', 'vi_VN').format(amount);
  }

  Future<void> _processPayment() async {
    if (_selectedMethod == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng chọn phương thức thanh toán'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() => _isProcessing = true);

    try {
      if (_selectedMethod == PaymentMethod.cod) {
        await _processCODPayment();
      } else {
        await _processVNPayPayment();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  Future<void> _processCODPayment() async {
    try {
      final response = await http.post(
        Uri.parse('http://192.168.1.2:8000/gateway/api/v1/payment-service/payment/create'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'sessionId': widget.sessionId,
          'stationId': widget.stationId,
          'userId': widget.userId,
          'amount': 30000,
          'method': 'COD',
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          _showSuccessDialog('Thanh toán COD thành công!');
        }
      } else {
        throw Exception('Thanh toán thất bại');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _processVNPayPayment() async {
    try {
      final response = await http.post(
        Uri.parse('http://192.168.1.2:8000/gateway/api/v1/payment-service/payment/create'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'sessionId': widget.sessionId,
          'stationId': widget.stationId,
          'userId': widget.userId,
          'amount': 30000,
          'method': 'VNPAY',
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final paymentResponse = PaymentResponse.fromJson(jsonDecode(response.body));
        
        if (mounted) {
          // Navigate to VNPay WebView
          final result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => VNPayWebViewScreen(
                paymentUrl: paymentResponse.paymentUrl,
                paymentId: paymentResponse.paymentId,
                txnRef: paymentResponse.txnRef,
              ),
            ),
          );

          if (result == true && mounted) {
            _showSuccessDialog('Thanh toán VNPay thành công!');
          }
        }
      } else {
        throw Exception('Không thể tạo thanh toán VNPay');
      }
    } catch (e) {
      rethrow;
    }
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF1A2332),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle,
                  color: Colors.green,
                  size: 64,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Thanh toán thành công!',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white60,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context); // Close payment screen
                  Navigator.pop(context); // Back to session detail
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  backgroundColor: const Color(0xFF00D9FF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Hoàn tất',
                  style: TextStyle(
                    color: Color(0xFF0A1929),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1929),
      body: SafeArea(
        child: Column(
          children: [
            _buildAppBar(),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildPaymentHeader(),
                    const SizedBox(height: 24),
                    _buildPaymentMethods(),
                    const SizedBox(height: 24),
                    _buildPaymentInfo(),
                  ],
                ),
              ),
            ),
            _buildBottomSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          const Expanded(
            child: Text(
              'Thanh toán',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 48),
        ],
      ),
    );
  }

  Widget _buildPaymentHeader() {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              const Color(0xFF00D9FF).withOpacity(0.2),
              const Color(0xFF00D9FF).withOpacity(0.05),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF00D9FF).withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text(
              'Tổng thanh toán',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${_formatCurrency(widget.totalAmount)} ₫',
              style: const TextStyle(
                color: Color(0xFF00D9FF),
                fontSize: 36,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Mã phiên: ${widget.sessionId.length > 8 ? widget.sessionId.substring(0, 8) : widget.sessionId}...',
              style: const TextStyle(
                color: Colors.white60,
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentMethods() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Chọn phương thức thanh toán',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        _buildPaymentMethodCard(
          method: PaymentMethod.vnpay,
          icon: Icons.account_balance,
          title: 'VNPay',
          subtitle: 'Thanh toán qua cổng VNPay',
          color: const Color(0xFF0062A3),
        ),
        const SizedBox(height: 12),
        _buildPaymentMethodCard(
          method: PaymentMethod.cod,
          icon: Icons.payments,
          title: 'Tiền mặt',
          subtitle: 'Thanh toán trực tiếp (COD)',
          color: Colors.green,
        ),
      ],
    );
  }

  Widget _buildPaymentMethodCard({
    required PaymentMethod method,
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
  }) {
    final isSelected = _selectedMethod == method;

    return GestureDetector(
      onTap: () => setState(() => _selectedMethod = method),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A2F3F).withOpacity(0.5),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? const Color(0xFF00D9FF)
                : Colors.white.withOpacity(0.1),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.white60,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected
                      ? const Color(0xFF00D9FF)
                      : Colors.white.withOpacity(0.3),
                  width: 2,
                ),
                color: isSelected ? const Color(0xFF00D9FF) : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(
                      Icons.check,
                      size: 16,
                      color: Color(0xFF0A1929),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentInfo() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A2F3F).withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(
                Icons.info_outline,
                color: Color(0xFF00D9FF),
                size: 20,
              ),
              SizedBox(width: 8),
              Text(
                'Thông tin',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Mã người dùng', widget.userId),
          const SizedBox(height: 12),
          _buildInfoRow('Mã trạm', widget.stationId),
          const SizedBox(height: 12),
          _buildInfoRow('Mã phiên', widget.sessionId),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.white60,
            fontSize: 13,
          ),
        ),
        Flexible(
          child: Text(
            value.length > 20 ? '${value.substring(0, 20)}...' : value,
            textAlign: TextAlign.right,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF0A1929),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: ElevatedButton(
          onPressed: _isProcessing ? null : _processPayment,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF00D9FF),
            disabledBackgroundColor: Colors.grey,
            minimumSize: const Size(double.infinity, 56),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 0,
          ),
          child: _isProcessing
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    color: Color(0xFF0A1929),
                    strokeWidth: 2,
                  ),
                )
              : const Text(
                  'Xác nhận thanh toán',
                  style: TextStyle(
                    color: Color(0xFF0A1929),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
        ),
      ),
    );
  }
}

// VNPay InAppWebView Screen
class VNPayWebViewScreen extends StatefulWidget {
  final String paymentUrl;
  final String paymentId;
  final String txnRef;

  const VNPayWebViewScreen({
    super.key,
    required this.paymentUrl,
    required this.paymentId,
    required this.txnRef,
  });

  @override
  State<VNPayWebViewScreen> createState() => _VNPayWebViewScreenState();
}

class _VNPayWebViewScreenState extends State<VNPayWebViewScreen> {
  InAppWebViewController? _webViewController;
  double _progress = 0;
  bool _isLoading = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1929),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0A1929),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text('Thanh toán VNPay'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => _showCancelDialog(),
        ),
      ),
      body: Stack(
        children: [
          InAppWebView(
            initialUrlRequest: URLRequest(
              url: WebUri(widget.paymentUrl),
            ),
            initialSettings: InAppWebViewSettings(
              javaScriptEnabled: true,
              domStorageEnabled: true,
              useShouldOverrideUrlLoading: true,
              useOnLoadResource: true,
              allowsBackForwardNavigationGestures: true,
            ),
            onWebViewCreated: (controller) {
              _webViewController = controller;
            },
            onLoadStart: (controller, url) {
              setState(() => _isLoading = true);
              _checkReturnUrl(url.toString());
            },
            onLoadStop: (controller, url) {
              setState(() => _isLoading = false);
            },
            onProgressChanged: (controller, progress) {
              setState(() => _progress = progress / 100);
            },
            shouldOverrideUrlLoading: (controller, navigationAction) async {
              final url = navigationAction.request.url.toString();
              _checkReturnUrl(url);
              return NavigationActionPolicy.ALLOW;
            },
          ),
          if (_isLoading)
            Container(
              color: const Color(0xFF0A1929),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(
                      color: Color(0xFF00D9FF),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Đang tải... ${(_progress * 100).toInt()}%',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          if (_progress < 1.0 && !_isLoading)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: LinearProgressIndicator(
                value: _progress,
                backgroundColor: Colors.white.withOpacity(0.1),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  Color(0xFF00D9FF),
                ),
              ),
            ),
        ],
      ),
    );
  }

  void _checkReturnUrl(String url) {
    debugPrint('Current URL: $url');
    
    // Check if this is the return URL from VNPay
    if (url.contains('vnpay_return')) {
      final uri = Uri.parse(url);
      final responseCode = uri.queryParameters['vnp_ResponseCode'];
      
      debugPrint('VNPay Response Code: $responseCode');
      
      if (responseCode == '00') {
        // Payment successful
        Navigator.pop(context, true);
      } else {
        // Payment failed
        _showFailureDialog(responseCode);
      }
    }
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF1A2332),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.warning_amber_rounded,
                color: Colors.orange,
                size: 64,
              ),
              const SizedBox(height: 16),
              const Text(
                'Hủy thanh toán?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Bạn có chắc muốn hủy giao dịch này?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white60,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Colors.white12,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Tiếp tục',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context); // Close dialog
                        Navigator.pop(context, false); // Close webview
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Hủy',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFailureDialog(String? responseCode) {
    // Mapping response codes to Vietnamese messages
    String getMessage(String? code) {
      switch (code) {
        case '07':
          return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
        case '09':
          return 'Giao dịch chưa hoàn tất. Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
        case '10':
          return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
        case '11':
          return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
        case '12':
          return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';
        case '13':
          return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).';
        case '24':
          return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
        case '51':
          return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';
        case '65':
          return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
        case '75':
          return 'Ngân hàng thanh toán đang bảo trì.';
        case '79':
          return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.';
        default:
          return 'Giao dịch thất bại. Vui lòng thử lại sau.';
      }
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: const Color(0xFF1A2332),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline,
                  color: Colors.red,
                  size: 64,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Thanh toán thất bại',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                getMessage(responseCode),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white60,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Mã lỗi: ${responseCode ?? "Không xác định"}',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context, false); // Close webview
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  backgroundColor: const Color(0xFF00D9FF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Đóng',
                  style: TextStyle(
                    color: Color(0xFF0A1929),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}