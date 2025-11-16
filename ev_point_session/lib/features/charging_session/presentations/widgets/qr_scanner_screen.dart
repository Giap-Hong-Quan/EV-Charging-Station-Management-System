import 'package:flutter/material.dart';
import 'package:qr_code_scanner_plus/qr_code_scanner_plus.dart';
import 'dart:io' show Platform;

class QrScannerScreen extends StatefulWidget {
  final Function(String) onQrScannedSuccessfully;

  const QrScannerScreen({super.key, required this.onQrScannedSuccessfully});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  bool isProcessing = false;

  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller?.pauseCamera();
    }
    controller?.resumeCamera();
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;

    controller.scannedDataStream.listen((scanData) {
      final code = scanData.code;

      if (code == null || code.isEmpty) {
        print('QR Code is null or empty');
        return;
      }

      // Chỉ xử lý một lần
      if (!isProcessing && mounted) {
        isProcessing = true;

        print('QR Code detected: $code');

        // Pause camera ngay lập tức
        controller.pauseCamera();

        // Delay rồi mới navigate
        Future.delayed(const Duration(milliseconds: 200), () {
          if (mounted) {
            print('Calling onQrScannedSuccessfully with: $code');
            widget.onQrScannedSuccessfully(code);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final scanArea = size.width * 0.75;

    return Column(
      children: [
        // CAMERA FIXED HEIGHT
        SizedBox(
          height: scanArea,
          width: scanArea,
          child: Stack(
            children: [
              QRView(
                key: qrKey,
                onQRViewCreated: _onQRViewCreated,
                overlay: QrScannerOverlayShape(
                  borderColor: Colors.teal,
                  borderRadius: 10,
                  borderLength: 30,
                  borderWidth: 8,
                  cutOutSize: scanArea * 0.85,
                ),
                onPermissionSet: (ctrl, p) {
                  print('Camera permission: $p');
                  if (!p) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Camera permission denied')),
                    );
                  }
                },
              ),
              Positioned(
                top: 20,
                left: 0,
                right: 0,
                child: Column(
                  children: const [
                    Icon(Icons.qr_code_scanner, color: Colors.white, size: 40),
                    SizedBox(height: 6),
                    Text(
                      'Scan QR Code',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Align the QR code within the frame',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              // Loading indicator khi đang xử lý
              if (isProcessing)
                Container(
                  color: Colors.black45,
                  child: const Center(
                    child: CircularProgressIndicator(color: Colors.white),
                  ),
                ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        Container(
          padding: const EdgeInsets.all(20),
          width: double.infinity,
          color: Colors.white,
          child: Row(
            children: [
              Icon(Icons.info_outline, color: Colors.teal.shade700, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Scan the QR code from your booking or user profile',
                  style: TextStyle(fontSize: 13, color: Colors.teal.shade700),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
