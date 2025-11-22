import 'package:ev_point/src/core/di/injection_container.dart';
import 'package:ev_point/src/features/auth/data/datasources/auth_local_datasources.dart';
import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_cubit.dart';
import 'package:ev_point/src/features/charging_station/presentations/cubit/charging_station_state.dart';
import 'package:ev_point/src/features/charging_station/presentations/pages/charging_station_detail_screen.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/charging_station_card.dart';
import 'package:ev_point/src/features/home/widgets/battery_status_card.dart';
import 'package:ev_point/src/features/home/widgets/header_appbar.dart';
import 'package:ev_point/src/features/home/widgets/quick_action_widget.dart';
import 'package:ev_point/src/features/home/widgets/search_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? currentUserToken;
  UserEntity? currentUser;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    context.read<ChargingStationCubit>().loadChargingStations();
    _loadCurrentUser();
  }

  Future<void> _loadCurrentUser() async {
    final authLocal = sl<AuthLocalDataSource>();
    final token = await authLocal.getCachedToken();
    setState(() {
      currentUserToken = token;
    });
    if (token == null || token.isEmpty) {
      setState(() => isLoading = false);
      return;
    }
    final userRepo = sl<IUserRepository>();
    try {
      final user = await userRepo.getCurrentProfileUser();
      setState(() {
        currentUser = user;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        isLoading = false;
      });
      debugPrint('Error load current user: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: HeaderAppbar(
        userName: currentUser?.fullname ?? '${currentUser}',
      ),
      backgroundColor: Colors.white,
      body: BlocBuilder<ChargingStationCubit, ChargingStationState>(
        builder: (context, state) {
          return Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.green[50]!, Colors.blue[50]!],
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // Header với gradient
                  SearchWidget(),

                  // Battery Status Card
                  BatteryStatusCard(),

                  // Quick Actions
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Truy cập nhanh',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: QuickActionWidget(
                                icon: Icons.location_on,
                                label: 'Tìm trạm',
                                color: Colors.blue[500]!,
                              ),
                            ),
                            Expanded(
                              child: QuickActionWidget(
                                icon: Icons.bolt,
                                label: 'Sạc nhanh',
                                color: Colors.yellow[700]!,
                              ),
                            ),
                            Expanded(
                              child: QuickActionWidget(
                                icon: Icons.history,
                                label: 'Lịch sử',
                                color: Colors.purple[500]!,
                              ),
                            ),
                            Expanded(
                              child: QuickActionWidget(
                                icon: Icons.credit_card,
                                label: 'Thanh toán',
                                color: Colors.pink[500]!,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Nearby Stations
                  Expanded(
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(30),
                          topRight: Radius.circular(30),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black12,
                            blurRadius: 20,
                            offset: Offset(0, -5),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(24),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Trạm gần bạn',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (state is ChargingStationLoaded &&
                                    state.chargingStations.length > 2)
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder:
                                              (context) =>
                                                  ChargingStationDetailScreen(
                                                    chargingStation:
                                                        state.chargingStations,
                                                  ),
                                        ),
                                      );
                                    },
                                    child: Row(
                                      children: [
                                        Text(
                                          'Xem tất cả',
                                          style: TextStyle(
                                            color: Colors.green[600],
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Icon(
                                          Icons.chevron_right,
                                          color: Colors.green[600],
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          Expanded(child: _buildStationList(state)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStationList(ChargingStationState state) {
    if (state is ChargingStationLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Colors.green),
      );
    }

    if (state is ChargingStationError) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text(
              'Có lỗi xảy ra',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              state.message,
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                context.read<ChargingStationCubit>().loadChargingStations();
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Thử lại'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green[600],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (state is ChargingStationLoaded) {
      if (state.chargingStations.isEmpty) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.ev_station_outlined,
                size: 64,
                color: Colors.grey[300],
              ),
              const SizedBox(height: 16),
              Text(
                'Không có trạm sạc',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Không tìm thấy trạm sạc nào',
                style: TextStyle(fontSize: 14, color: Colors.grey[500]),
              ),
            ],
          ),
        );
      }

      return ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        itemCount:
            state.chargingStations.length > 1
                ? 2
                : state.chargingStations.length,
        itemBuilder: (context, index) {
          return ChargingStationCard(
            chargingStation: state.chargingStations[index],
          );
        },
      );
    }

    return const SizedBox.shrink();
  }
}
