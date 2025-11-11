import 'dart:async';
import 'package:ev_point_session/features/charging_session/data/models/booking_model.dart';
import 'package:ev_point_session/features/charging_session/domain/entities/booking.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_sesion_cubit.dart';
import 'package:ev_point_session/features/charging_session/presentations/cubit/charging_session_state.dart';
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
  final TextEditingController _durationController = TextEditingController();

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
      context.read<ChargingSessionCubit>().getBookingByBookingCode(bookingCode);
    });
  }

  void _fillBookingData(Booking booking) {
    _vehicleNameController.text = booking.vehicleName ?? '';
    _vehicleNumberController.text = booking.vehicleNumber ?? '';
    _durationController.text = booking.scheduleStartTime?.toString() ?? '';
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _bookingCodeController.removeListener(_onBookingCodeChanged);
    _bookingCodeController.dispose();
    _vehicleNameController.dispose();
    _vehicleNumberController.dispose();
    _durationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Phiên sạc'),
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
                  final bookingModel = state.booking as BookingModel;

                  debugPrint('Booking found: $bookingModel');
                  debugPrint(
                    'Filling booking data into form fields: ${bookingModel.id}, ${bookingModel.vehicleName}, ${bookingModel.vehicleNumber}',
                  );
                  _fillBookingData(bookingModel);
                }
              },
              builder: (context, state) {
                // if (state is ChargingSessionLoading) {
                //   return const Center(child: CircularProgressIndicator());
                // }
                if (_isManualInput) {
                  return BuildManualInput(
                    formKey: _formKey,
                    bookingCodeController: _bookingCodeController,
                    vehicleNameController: _vehicleNameController,
                    vehicleNumberController: _vehicleNumberController,
                    durationController: _durationController,
                    onDurationChanged: (value) {},
                    onSubmit: () {
                      // if(_formKey.currentState!.validate()){
                      //   context.read<ChargingSessionCubit>().startChargingSessionManual(
                      //     bookingCode: _bookingCodeController.text,
                      //     vehicleName: _vehicleNameController.text,
                      //     vehicleNumber: _vehicleNumberController.text,
                      //     duration: int.tryParse(_durationController.text) ?? 0,
                      //   );
                      // }
                    },
                  );
                } else {
                  return BuildQrScannerView(
                    bookingCodeController: _bookingCodeController,
                    vehicleNameController: _vehicleNameController,
                    vehicleNumberController: _vehicleNumberController,
                    selectedDuration: _selectedDurations,
                    selectedPowerLevel: _selectedPowerLevel,
                    onDurationChanged:
                        (v) => setState(() => _selectedDurations = v),
                    onPowerLevelChanged:
                        (v) => setState(() => _selectedPowerLevel = v),
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
