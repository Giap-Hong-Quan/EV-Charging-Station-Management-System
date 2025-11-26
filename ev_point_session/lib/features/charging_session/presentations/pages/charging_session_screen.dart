import 'dart:async';

import 'package:ev_point_session/core/routes/path_routers.dart';
import 'package:ev_point_session/features/charging_session/data/dto/charging_session_active_dto.dart';
import 'package:ev_point_session/features/charging_session/data/dto/request_create_dto.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_manual_input.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_qr_scanner_view.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_toggle_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

class ChargingSessionScreen extends StatefulWidget {
  const ChargingSessionScreen({super.key});

  @override
  State<ChargingSessionScreen> createState() => _ChargingSessionScreenState();
}

class _ChargingSessionScreenState extends State<ChargingSessionScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _bookingCodeController = TextEditingController();
  final TextEditingController _vehicleNameController = TextEditingController();
  final TextEditingController _vehicleNumberController =
      TextEditingController();
  final TextEditingController _timeStartController = TextEditingController();

  String? userId;
  String? stationId;
  String? chargingPointId;
  int? startSocPercent;

  bool _isManualInput = true;
  String? _selectedDurations;
  String? _selectedPowerLevel;
  int? powerKWh;
  int? pricePerKWh;

  String? stationName;
  int? pointNumber;
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _bookingCodeController.addListener(_onBookingCodeChanged);
  }

  void _onBookingCodeChanged() {
    if (_debounce?.isActive ?? false) _debounce!.cancel();

    _debounce = Timer(const Duration(milliseconds: 500), () {
      final bookingCode = _bookingCodeController.text.trim();
      if (bookingCode.isNotEmpty) {
        context.read<ChargingSessionCubit>().getBookingByBookingCode(
          bookingCode,
        );
      }
    });
  }

  void _fillBookingData(Booking booking) {
    setState(() {
      _vehicleNameController.text = booking.vehicleName ?? '';
      _vehicleNumberController.text = booking.vehicleNumber ?? '';
      _timeStartController.text = booking.scheduleStartTime?.toString() ?? '';
      userId = booking.userId;
      stationId = booking.stationId;
      chargingPointId = booking.pointId;
      startSocPercent = 25;
    });
    debugPrint(
      'Filled booking data: userId=$userId, stationId=$stationId, chargingPointId=$chargingPointId',
    );
  }

  void _startSession() {
    if (!_formKey.currentState!.validate()) return;

    final bookingCode = _bookingCodeController.text.trim();
    final vehicleName = _vehicleNameController.text.trim();
    final vehicleNumber = _vehicleNumberController.text.trim();
    final userDTO = userId ?? '';
    final stationIdDTO = stationId ?? '';
    final chargingPointIdDTO = chargingPointId ?? '';

    final requestDto = RequestCreateChargingSessionDto(
      bookingCode: bookingCode,
      userId: userDTO,
      stationId: stationIdDTO,
      chargingPointId: chargingPointIdDTO,
      startSocPercent: startSocPercent ?? 25,
      vehicleName: vehicleName,
      vehicleNumber: vehicleNumber,
    );

    debugPrint("Creating session with: ${requestDto.toJson()}");
    context.read<ChargingSessionCubit>().createChargingSession(requestDto);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _bookingCodeController.removeListener(_onBookingCodeChanged);
    _bookingCodeController.dispose();
    _vehicleNameController.dispose();
    _vehicleNumberController.dispose();
    _timeStartController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Điểm sạc EV'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          BuildToggleButton(
            isManualInput: _isManualInput,
            onChanged: (value) => setState(() => _isManualInput = value),
          ),
          Expanded(
            child: BlocConsumer<ChargingSessionCubit, ChargingSessionState>(
              listener: (context, state) {
                if (state is ChargingSessionError) {
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text(state.message)));
                }

                if (state is ChargingSessionChecked) {
                  final booking = state.booking;
                  _fillBookingData(booking);
                }

                if (state is ChargingSessionCreated) {
                  context.push(
                    PathRouters.chargingSessionActiveScreen,
                    extra: ChargingSessionActiveDto(
                  
                      sessionId: state.chargingSession.id,
                      userId: userId ?? '',
                      stationId: stationId ?? '',
                      powerKWh: powerKWh ?? 0, 
                      pricePerKWh: pricePerKWh ?? 0, 
                      startTimeCharging: DateTime.now().millisecondsSinceEpoch,
                      stationName: stationName ?? 'Unknown Station',
                      pointNumber: pointNumber ?? 0,
                      startTime: DateTime.now(),
                    ),
                  );
                }
              },
              builder: (context, state) {
                final isLoading = state is ChargingSessionLoading;

                if (_isManualInput) {
                  return BuildManualInput(
                    formKey: _formKey,
                    bookingCodeController: _bookingCodeController,
                    vehicleNameController: _vehicleNameController,
                    vehicleNumberController: _vehicleNumberController,
                    timeStartController: _timeStartController,
                    onTimeStartChanged: (value) {
                      _timeStartController.text = value ?? '';
                    },
                    onSubmit: isLoading ? null : _startSession,
                  );
                } else {
                  return BuildQrScannerView(
                    bookingCodeController: _bookingCodeController,
                    vehicleNameController: _vehicleNameController,
                    vehicleNumberController: _vehicleNumberController,
                    selectedDuration: _selectedDurations,
                    selectedPowerLevel: _selectedPowerLevel,
                    timeStartController: _timeStartController,
                    onTimeStartChanged: (value) {
                      _timeStartController.text = value ?? '';
                    },
                    onPowerLevelChanged: (value) {
                      setState(() {
                        _selectedPowerLevel = value;
                      });
                    },
                    onUserIdChanged: (value) {
                      setState(() {
                        userId = value;
                      });
                    },
                    onStationIdChanged: (value) {
                      setState(() {
                        stationId = value;
                      });
                    },
                    onChargingPointIdChanged: (value) {
                      setState(() {
                        chargingPointId = value;
                      });
                    },
                    onPowerKWhChanged: (value) {
                      setState(() {
                        powerKWh = value;
                      });
                    },
                    onPricePerKWhChanged: (value) {
                      setState(() {
                        pricePerKWh = value;
                      });
                    },
                    onStationNameChanged: (value) {
                      setState(() {
                        stationName = value;
                      });
                    },
                    onPointNumberChanged: (value) {
                      setState(() {
                        pointNumber = value;
                      });
                    },
                
                    onScanComplete: () {
                      setState(() {
                        _isManualInput = true;
                      });
                    },
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
