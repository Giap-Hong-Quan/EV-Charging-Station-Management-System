import 'dart:async';

import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
import 'package:ev_point_session/features/charging_session/presentations/pages/charging_session_start.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_manual_input.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_qr_scanner_view.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_toggle_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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

  bool _isManualInput = true;
  String? _selectedDurations;
  String? _selectedPowerLevel;

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
    _vehicleNameController.text = booking.vehicleName ?? '';
    _vehicleNumberController.text = booking.vehicleNumber ?? '';
    _timeStartController.text = booking.scheduleStartTime?.toString() ?? '';
  }

  // === HÀM BẮT ĐẦU PHIÊN SẠC ===
  void _startSession() {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final bookingCode = _bookingCodeController.text.trim();
    final vehicleName = _vehicleNameController.text.trim();
    final vehicleNumber = _vehicleNumberController.text.trim();
    final timeStart = _timeStartController.text.trim();

    Navigator.of(context).push(
      MaterialPageRoute(
        builder:
            (_) => ChargingSessionStartScreen(
              bookingCode: bookingCode,
              vehicleName: vehicleName,
              vehicleNumber: vehicleNumber,
              timeStart: timeStart,
            ),
      ),
    );
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

                  debugPrint('Booking found: $booking');
                  
                  _fillBookingData(booking);        
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ChargingSessionStartScreen(
                        bookingCode: booking.bookingCode,
                        vehicleName: booking.vehicleName ?? '',
                        vehicleNumber: booking.vehicleNumber ?? '',
                        timeStart:
                            booking.scheduleStartTime?.toString() ?? '',
                      ),
                    ),
                  );  

                }
              },
              builder: (context, state) {
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
                    onSubmit: _startSession,
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
                    // THÊM callback để chuyển về manual input sau khi scan
                    // onScanComplete: () {
                    //   setState(() {
                    //     _isManualInput = true;
                    //   });
                    // },
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
