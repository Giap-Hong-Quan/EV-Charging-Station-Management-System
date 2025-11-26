import 'dart:async';
import 'dart:math' as math;

import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_end_charging_session_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/charging_session_detail_dto.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class ChargingSessionActiveScreen extends StatefulWidget {
  final String sessionId;
  final String userId;
  final String stationId;
  final int powerKWh;
  final int pricePerKWh;
  final int startSocPercent;
  final String stationName;
  final int pointNumber;
  final DateTime startTime;
  const ChargingSessionActiveScreen({
    super.key,
    required this.sessionId,
    required this.userId,
    required this.stationId,
    required this.powerKWh,
    required this.pricePerKWh,
    required this.stationName,
    required this.pointNumber,
    required this.startTime,
    this.startSocPercent = 25,
  });

  @override
  State<ChargingSessionActiveScreen> createState() =>
      _ChargingSessionActiveScreenState();
}

class _ChargingSessionActiveScreenState
    extends State<ChargingSessionActiveScreen>
    with TickerProviderStateMixin {
  // Session data
  late DateTime startTime;
  late int currentBatteryPercent;
  final int targetBatteryPercent = 100;

  static int batteryCapacityKWh = 60;

  bool isCharging = true;

  // Timer
  Timer? _timer;
  Duration elapsedTime = Duration.zero;

  // Animation
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  late AnimationController _waveController;

  @override
  void initState() {
    super.initState();
    currentBatteryPercent = widget.startSocPercent;
    startTime = DateTime.now();
    _initAnimations();
    _startTimer();
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

        final totalSeconds = elapsedTime.inSeconds;

        // kWh đã sạc được đến hiện tại
        final chargedKWh =
            (widget.powerKWh * totalSeconds) / 3600.0; // kWh = kW * h

        // % pin tăng thêm
        final percentIncrease =
            (chargedKWh / batteryCapacityKWh) * 100.0; // (%)

        // SOC hiện tại = SOC ban đầu + % tăng
        final newPercent = (widget.startSocPercent + percentIncrease).clamp(
          0.0,
          100.0,
        );

        currentBatteryPercent = newPercent.round();

        // Auto stop khi đạt target (hoặc 100%)
        if (currentBatteryPercent >= targetBatteryPercent ||
            currentBatteryPercent >= 100) {
          currentBatteryPercent = math.min(
            targetBatteryPercent,
            100,
          ); // đảm bảo không > 100
          isCharging = false;
          _pulseController.stop();
        }
      });
    });
  }

  /// Tổng kWh đã sạc tới thời điểm hiện tại
  double get _chargedKWh {
    return (widget.powerKWh * elapsedTime.inSeconds) / 3600.0;
  }

  /// Thời gian còn lại để từ SOC hiện tại lên targetBatteryPercent
  Duration get _remainingTime {
    if (!isCharging || currentBatteryPercent >= targetBatteryPercent) {
      return Duration.zero;
    }

    final percentRemaining =
        targetBatteryPercent - currentBatteryPercent; // % còn thiếu

    // kWh cần thêm để lên target
    final kWhNeeded = batteryCapacityKWh * (percentRemaining / 100.0); // kWh

    // Thời gian cần (giây) = kWh / kW * 3600
    final secondsNeeded = (kWhNeeded / widget.powerKWh) * 3600.0;

    return Duration(seconds: secondsNeeded.round());
  }

  /// Tổng tiền = kWh đã sạc * đơn giá
  double get _totalCost {
    return _chargedKWh * widget.pricePerKWh;
  }

  void _stopCharging() {
    final endChargingSessionDTO = RequestEndChargingSessionDto(
      sessionId: widget.sessionId,
      endSocPercent: currentBatteryPercent,
      totalPrice: _totalCost.toInt(),
      totalKwh: _chargedKWh,
    );

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
                'Kết thúc phiên sạc?',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Bạn có chắc muốn kết thúc phiên sạc ở mức $currentBatteryPercent%?',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white60, fontSize: 14),
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
                        'Hủy',
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        // đóng dialog
                        Navigator.pop(context);

                        // dừng tính toán local
                        setState(() {
                          isCharging = false;
                        });

                        // call Cubit stop session
                        context
                            .read<ChargingSessionCubit>()
                            .stopChargingSession(endChargingSessionDTO);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: const Color(0xFF00D9FF),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Kết thúc',
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
    return '$hours:$minutes';
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
    return BlocConsumer<ChargingSessionCubit, ChargingSessionState>(
      listener: (context, state) {
        if (state is ChargingSessionStoppedSuccess) {
          print("station name: $state ${widget.stationName}, point number: ${widget.pointNumber}");
          final session = state.chargingSession; 
          final detailDto = ChargingSessionDetailDto(
            userId: widget.userId, // Replace with actual user ID
            stationId: widget.stationId, // Replace with actual station ID
            chargingSession: session,
            powerDelivered: _chargedKWh.toInt(),
            stationName: widget.stationName,
            pointNumber: widget.pointNumber,
            startSocPercent: widget.startSocPercent,
            endSocPercent: currentBatteryPercent,
            durationMinutes: elapsedTime.inMinutes,
            startTime: widget.startTime,
            endTime: DateTime.now(),
          );

          print(  "Navigating to details with DTO: ${detailDto.toJson()}");

          context.push(
            PathRouters.chargingSessionDetailsScreen,
            extra: detailDto,
          );
        }

        if (state is ChargingSessionError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      builder: (context, state) {
        final isLoading = state is ChargingSessionStopping;

        return Stack(
          children: [
            Scaffold(
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
                        _buildAppBar(),
                        const SizedBox(height: 20),
                        _buildChargingAnimation(),
                        _buildBatteryInfo(),
                        const SizedBox(height: 32),
                        _buildStatsCards(),
                        const SizedBox(height: 24),
                        _buildStopButton(),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            if (isLoading)
              Container(
                color: Colors.black54,
                child: const Center(
                  child: CircularProgressIndicator(
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Color(0xFF00D9FF)),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildAppBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildIconButton(Icons.arrow_back, () => Navigator.pop(context)),
          const Text(
            'Đang sạc',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          _buildIconButton(Icons.more_vert, () {}),
        ],
      ),
    );
  }

  Widget _buildIconButton(IconData icon, VoidCallback onPressed) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: IconButton(
        icon: Icon(icon, color: Colors.white),
        onPressed: onPressed,
      ),
    );
  }

  Widget _buildChargingAnimation() {
    return Expanded(
      child: Center(
        child: AnimatedBuilder(
          animation: _pulseAnimation,
          builder: (context, child) {
            return Stack(
              alignment: Alignment.center,
              children: [
                // Outer pulse circles
                ...List.generate(3, (index) {
                  final scale =
                      1.0 + (_pulseAnimation.value * 0.5) - (index * 0.15);
                  final opacity =
                      (1.0 - _pulseAnimation.value) * (1.0 - index * 0.3);
                  return Container(
                    width: 280 * scale,
                    height: 280 * scale,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(
                          0xFF00D9FF,
                        ).withOpacity(opacity * 0.3),
                        width: 2,
                      ),
                    ),
                  );
                }),

                // Main circle with car
                Container(
                  width: 280,
                  height: 280,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const RadialGradient(
                      colors: [Color(0xFF1A2F3F), Color(0xFF0A1929)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00D9FF).withOpacity(0.2),
                        blurRadius: 40,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.directions_car,
                    size: 100,
                    color: Color(0xFF00D9FF),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildBatteryInfo() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.bolt, color: Color(0xFF00D9FF), size: 24),
            SizedBox(width: 8),
            Text(
              'Đang sạc',
              style: TextStyle(color: Colors.white70, fontSize: 16),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          '$currentBatteryPercent%',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 64,
            fontWeight: FontWeight.bold,
            height: 1,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          '${_formatDuration(_remainingTime)} Còn lại',
          style: const TextStyle(color: Colors.white60, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildStatsCards() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _buildStatCard(
              icon: Icons.speed,
              label: 'Công suất',
              value: '${widget.powerKWh} kW',
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildStatCard(
              icon: Icons.attach_money,
              label: 'Chi phí',
              // Nếu muốn hiển thị tổng tiền real-time:
              // value: '${_totalCost.toStringAsFixed(0)} đ',
              value: '${widget.pricePerKWh}/kWh',
            ),
          ),
        ],
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
        border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF00D9FF).withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: const Color(0xFF00D9FF), size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
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

  Widget _buildStopButton() {
    return Padding(
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
          'Kết thúc',
          style: TextStyle(
            color: Color(0xFF0A1929),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
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
      final y =
          size.height * (0.3 + index * 0.15) +
          waveHeight *
              (1 + index * 0.5) *
              (0.5 + 0.5 * math.sin((x - offset) / waveLength * 2 * math.pi));
      path.lineTo(x, y);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(WavePainter oldDelegate) {
    return animation != oldDelegate.animation;
  }
}
