import 'package:ev_point_session/features/charging_session/presentations/widgets/build_manual_input.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_qr_scanner_view.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_toggle_button.dart';
import 'package:flutter/material.dart';

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

  bool _isManualInput = true;

  final List<String> _durations = const ['30 phút', '1 giờ', '2 giờ'];
  String? _selectedDuration;

  String? _selectedDurations;
  String? _selectedPowerLevel;

  @override
  void dispose() {
    _bookingCodeController.dispose();
    _vehicleNameController.dispose();
    _vehicleNumberController.dispose();
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
          // dùng widget đã sửa
          BuildToggleButton(
            isManualInput: _isManualInput,
            onChanged: (value) => setState(() => _isManualInput = value),
          ),
          Expanded(
            child:
                _isManualInput
                    ? BuildManualInput(
                      formKey: _formKey,
                      bookingCodeController: _bookingCodeController,
                      vehicleNameController: _vehicleNameController,
                      vehicleNumberController: _vehicleNumberController,
                      onSubmit: () {
                        if (_formKey.currentState!.validate()) {
                          // Handle form submission
                        }
                      },
                      durations: _durations,
                      selectedDuration: _selectedDuration,
                      onDurationChanged: (value) {
                        setState(() => _selectedDuration = value);
                      },
                    )
                    : BuildQrScannerView(
                      bookingCodeController: _bookingCodeController,
                      vehicleNameController: _vehicleNameController,
                      vehicleNumberController: _vehicleNumberController,
                      selectedDuration: _selectedDurations,
                      selectedPowerLevel: _selectedPowerLevel,
                      onDurationChanged:
                          (v) => setState(() => _selectedDurations = v),
                      onPowerLevelChanged:
                          (v) => setState(() => _selectedPowerLevel = v),
                    ),
          ),
        ],
      ),
    );
  }
}
