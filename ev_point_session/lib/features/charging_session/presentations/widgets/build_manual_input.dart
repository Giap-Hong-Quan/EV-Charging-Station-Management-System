import 'package:ev_point_session/features/charging_session/presentations/widgets/build_drop_down_filed.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_selection_title.dart';
import 'package:ev_point_session/features/charging_session/presentations/widgets/build_text_field.dart';
import 'package:flutter/material.dart';

class BuildManualInput extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController bookingCodeController;
  final TextEditingController vehicleNameController;
  final TextEditingController vehicleNumberController;

  final List<String> durations;
  final String? selectedDuration;
  final ValueChanged<String?> onDurationChanged;

  final VoidCallback? onSubmit;

  const BuildManualInput({
    super.key,
    required this.formKey,
    required this.bookingCodeController,
    required this.vehicleNameController,
    required this.vehicleNumberController,
    required this.durations,
    required this.selectedDuration,
    required this.onDurationChanged,
    this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const BuildSelectionTitle(title: 'Nhập thông tin để bắt đầu phiên sạc'),
            const SizedBox(height: 16),


            BuildTextField(label: 'Mã đặt chỗ', icon: Icons.code, keyboardType: TextInputType.text),
            const SizedBox(height: 16),

            BuildTextField(label: 'Tên xe', icon: Icons.directions_car, keyboardType: TextInputType.text),
            const SizedBox(height: 16),

            BuildTextField(label: 'Biển số xe', icon: Icons.confirmation_number, keyboardType: TextInputType.text),

            const SizedBox(height: 16),
            BuildDropDownFiled(
              label: 'Thời gian sạc',
              icon: Icons.access_time,
              value: selectedDuration,
              durations: durations,
              onDurationChanged: onDurationChanged,
            ),

            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                ),
                child: const Text(
                  'Bắt đầu phiên sạc',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
