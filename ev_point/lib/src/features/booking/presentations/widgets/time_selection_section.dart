import 'package:ev_point/src/features/booking/presentations/widgets/build_datetime_now.dart';
import 'package:flutter/material.dart';

class TimeSelectionSection extends StatefulWidget {
  final ValueChanged<DateTime>? onStartTimeChanged;
  final ValueChanged<DateTime>? onEndTimeChanged;

  const TimeSelectionSection({
    super.key,
    this.onStartTimeChanged,
    this.onEndTimeChanged,
  });

  @override
  State<TimeSelectionSection> createState() => _TimeSelectionSectionState();
}

class _TimeSelectionSectionState extends State<TimeSelectionSection> {
  DateTime selectedDate = DateTime.now();
  TimeOfDay selectedTime = const TimeOfDay(hour: 10, minute: 0);
  DateTime? selectedStartTime;
  DateTime? selectedEndTime;
  
  String _formatDateTime(DateTime dateTime) {
    final days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    final dayOfWeek = days[dateTime.weekday % 7];
    
    return '$dayOfWeek, ${dateTime.day.toString().padLeft(2, '0')}/${dateTime.month.toString().padLeft(2, '0')}/${dateTime.year} - ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  String _calculateDuration() {
    if (selectedStartTime == null || selectedEndTime == null) return '';
    
    final duration = selectedEndTime!.difference(selectedStartTime!);
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    
    if (hours > 0 && minutes > 0) {
      return '$hours giờ $minutes phút';
    } else if (hours > 0) {
      return '$hours giờ';
    } else {
      return '$minutes phút';
    }
  }

  Future<void> _selectDateTime(BuildContext context, bool isStartTime) async {
    final DateTime initialDate = isStartTime && selectedStartTime != null
        ? selectedStartTime!
        : !isStartTime && selectedEndTime != null
            ? selectedEndTime!
            : DateTime.now();

    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Colors.green,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null && context.mounted) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.fromDateTime(initialDate),
        builder: (context, child) {
          return Theme(
            data: Theme.of(context).copyWith(
              colorScheme: ColorScheme.light(
                primary: Colors.green,
              ),
            ),
            child: child!,
          );
        },
      );

      if (pickedTime != null) {
        final DateTime selectedDateTime = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );

        setState(() {
          if (isStartTime) {
            selectedStartTime = selectedDateTime;
            // Notify parent
            widget.onStartTimeChanged?.call(selectedDateTime);
            
            // Auto set end time to 1 hour after start time if not set
            if (selectedEndTime == null || selectedEndTime!.isBefore(selectedDateTime)) {
              selectedEndTime = selectedDateTime.add(const Duration(hours: 1));
              widget.onEndTimeChanged?.call(selectedEndTime!);
            }
          } else {
            // Validate end time is after start time
            if (selectedStartTime != null && selectedDateTime.isBefore(selectedStartTime!)) {
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Thời gian kết thúc phải sau thời gian bắt đầu'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
              return;
            }
            selectedEndTime = selectedDateTime;
            // Notify parent
            widget.onEndTimeChanged?.call(selectedDateTime);
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.access_time_rounded, color: Colors.green, size: 22),
            const SizedBox(width: 8),
            Text(
              'Thời gian đến sạc',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Start time
        BuildDatetimeNow(
          label: 'Bắt đầu',
          value: selectedStartTime != null
              ? _formatDateTime(selectedStartTime!)
              : 'Chọn thời gian',
          onTap: () => _selectDateTime(context, true),
        ),
        
        const SizedBox(height: 12),
        
        // End time
        Opacity(
          opacity: selectedStartTime != null ? 1.0 : 0.5,
          child: BuildDatetimeNow(
            label: 'Kết thúc',
            value: selectedEndTime != null
                ? _formatDateTime(selectedEndTime!)
                : 'Chọn thời gian',
            onTap: selectedStartTime != null 
                ? () => _selectDateTime(context, false)
                : () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Vui lòng chọn thời gian bắt đầu trước'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
          ),
        ),
        
        // Duration info
        if (selectedStartTime != null && selectedEndTime != null) ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.green[50],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.green[100]!),
            ),
            child: Row(
              children: [
                Icon(Icons.hourglass_bottom_rounded, size: 20, color: Colors.green[700]),
                const SizedBox(width: 12),
                Text(
                  'Thời lượng sạc: ${_calculateDuration()}',
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.green[800],
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}