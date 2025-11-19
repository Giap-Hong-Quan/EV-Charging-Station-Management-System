import 'dart:async';
import 'package:flutter/material.dart';

class ChargingSessionActiveScreen extends StatefulWidget {
  final String bookingCode;
  final String vehicleName;
  final String vehicleNumber;

  const ChargingSessionActiveScreen({
    super.key,
    required this.bookingCode,
    required this.vehicleName,
    required this.vehicleNumber,
  });

  @override
  State<ChargingSessionActiveScreen> createState() =>
      _ChargingSessionActiveScreenState();
}

class _ChargingSessionActiveScreenState
    extends State<ChargingSessionActiveScreen> with TickerProviderStateMixin {
  // Session data
  late DateTime startTime;
  int currentBatteryPercent = 38;
  int targetBatteryPercent = 80;
  double powerKW = 7.2;
  double totalCost = 24.0;
  double mileage = 742.3;
  bool isCharging = true;

  // Timer
  Timer? _timer;
  Duration elapsedTime = const Duration(minutes: 12, seconds: 46);
  Duration remainingTime = const Duration(minutes: 12, seconds: 46);

  // Animation
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  late AnimationController _waveController;

  @override
  void initState() {
    super.initState();
    startTime = DateTime.now().subtract(elapsedTime);
    _startTimer();
    _initAnimations();
  }

  void _initAnimations() {
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat();

    _pulseAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _waveController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!isCharging) return;

      setState(() {
        elapsedTime = DateTime.now().difference(startTime);

        // Simulate battery charging (1% every 2 minutes)
        if (elapsedTime.inSeconds % 120 == 0 &&
            currentBatteryPercent < targetBatteryPercent) {
          currentBatteryPercent++;
        }

        // Calculate remaining time
        final percentRemaining = targetBatteryPercent - currentBatteryPercent;
        remainingTime = Duration(minutes: percentRemaining * 2);

        // Update cost
        totalCost = (powerKW * elapsedTime.inSeconds) / 3600 * 3.5;

        // Auto stop when reaching target
        if (currentBatteryPercent >= targetBatteryPercent) {
          isCharging = false;
          _pulseController.stop();
        }
      });
    });
  }

  void _stopCharging() {
    showDialog(
      context: context,
      barrierColor: Colors.black54,
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
                'Stop Charging?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Are you sure you want to stop charging at $currentBatteryPercent%?',
                textAlign: TextAlign.center,
                style: const TextStyle(
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
                        'Cancel',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context); // Close dialog
                        Navigator.pop(context); // Close charging screen
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: const Color(0xFF00D9FF),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Stop',
                        style: TextStyle(
                          color: Color(0xFF0A1929),
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

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final hours = twoDigits(duration.inHours);
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$hours:$minutes:$seconds';
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulseController.dispose();
    _waveController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1929),
      body: SafeArea(
        child: Stack(
          children: [
            // Background waves
            ...List.generate(3, (index) {
              return AnimatedBuilder(
                animation: _waveController,
                builder: (context, child) {
                  return Positioned.fill(
                    child: CustomPaint(
                      painter: WavePainter(
                        animation: _waveController.value,
                        index: index,
                      ),
                    ),
                  );
                },
              );
            }),

            // Main content
            Column(
              children: [
                // App bar
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                      const Text(
                        'Charging',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.more_vert, color: Colors.white),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Car visualization with charging animation
                Expanded(
                  child: Center(
                    child: AnimatedBuilder(
                      animation: _pulseAnimation,
                      builder: (context, child) {
                        return Stack(
                          alignment: Alignment.center,
                          children: [
                            // Outer pulse circles
                            ...List.generate(3, (index) {
                              final scale = 1.0 + (_pulseAnimation.value * 0.5) - (index * 0.15);
                              final opacity = (1.0 - _pulseAnimation.value) * (1.0 - index * 0.3);
                              return Container(
                                width: 280 * scale,
                                height: 280 * scale,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: const Color(0xFF00D9FF).withOpacity(opacity * 0.3),
                                    width: 2,
                                  ),
                                ),
                              );
                            }),

                            // Main circle
                            Container(
                              width: 280,
                              height: 280,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: RadialGradient(
                                  colors: [
                                    const Color(0xFF1A2F3F),
                                    const Color(0xFF0A1929),
                                  ],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF00D9FF).withOpacity(0.2),
                                    blurRadius: 40,
                                    spreadRadius: 5,
                                  ),
                                ],
                              ),
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  // Car image
                                  Image.asset(
                                    'assets/car_top_view.png', // Add your car asset
                                    width: 120,
                                    height: 200,
                                    color: const Color(0xFF00D9FF),
                                    errorBuilder: (context, error, stackTrace) {
                                      return Icon(
                                        Icons.directions_car,
                                        size: 100,
                                        color: const Color(0xFF00D9FF),
                                      );
                                    },
                                  ),

                                  // Charging indicator line
                                  Positioned(
                                    top: 90,
                                    left: 90,
                                    right: 90,
                                    child: Container(
                                      height: 3,
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            Colors.transparent,
                                            const Color(0xFF00D9FF),
                                            Colors.transparent,
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),

                // Battery info
                Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.bolt,
                          color: const Color(0xFF00D9FF),
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Charging',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '$currentBatteryPercent',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 64,
                            fontWeight: FontWeight.bold,
                            height: 1,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Text(
                            '.45%',
                            style: const TextStyle(
                              color: Colors.white60,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${_formatDuration(remainingTime).substring(0, 5)} Time Remaining',
                      style: const TextStyle(
                        color: Colors.white60,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 32),

                // Stats cards
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          icon: Icons.speed,
                          label: 'Mileage',
                          value: '${mileage.toStringAsFixed(1)} km',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          icon: Icons.attach_money,
                          label: 'Total Cost',
                          value: '${totalCost.toStringAsFixed(0)} USD',
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Stop button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: ElevatedButton(
                    onPressed: _stopCharging,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00D9FF),
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: const Text(
                      'Stop Charging',
                      style: TextStyle(
                        color: Color(0xFF0A1929),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A2F3F).withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF00D9FF).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: const Color(0xFF00D9FF),
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white60,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Wave painter for background animation
class WavePainter extends CustomPainter {
  final double animation;
  final int index;

  WavePainter({required this.animation, required this.index});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF00D9FF).withOpacity(0.05 - (index * 0.01))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final path = Path();
    final waveHeight = 20.0;
    final waveLength = size.width / 2;
    final offset = animation * waveLength;

    path.moveTo(0, size.height * (0.3 + index * 0.15));

    for (double x = 0; x <= size.width; x++) {
      final y = size.height * (0.3 + index * 0.15) +
          waveHeight * 
          (1 + index * 0.5) *
          (0.5 + 0.5 * Math.sin((x - offset) / waveLength * 2 * Math.pi));
      path.lineTo(x, y);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(WavePainter oldDelegate) {
    return animation != oldDelegate.animation;
  }
}

// Math helper
class Math {
  static double sin(double value) => value.sign * (value.abs() % (2 * pi));
  static const double pi = 3.14159265359;
}