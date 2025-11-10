import 'package:ev_point/src/core/utils/app_color.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/build_datetime_now.dart';
import 'package:flutter/material.dart';

class DatetimeSelection extends StatefulWidget {
  const DatetimeSelection({super.key});

  @override
  State<DatetimeSelection> createState() => _DatetimeSelectionState();
}

class _DatetimeSelectionState extends State<DatetimeSelection> {
  DateTime selectedDate = DateTime.now();
  TimeOfDay selectedTime = const TimeOfDay(hour: 10, minute: 0);

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: AppColors.primary),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && mounted) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  Future<void> selectTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: selectedTime,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(primary: Color(0xFF00C853)),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && mounted) {
      setState(() {
        selectedTime = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Booking Date
        BuildDatetimeNow(
          label: 'Ngày đến',
          value: '${selectedDate.day} Dec, ${selectedDate.year}',
          onTap: _selectDate,
        ),
        const SizedBox(height: 16),
        // Time of Arrival
      ],
    );
  }
}
