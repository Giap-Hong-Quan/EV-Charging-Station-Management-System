import 'package:flutter/material.dart';

class BuildDropDownFiled extends StatelessWidget {
  final String? value;
  final String label;
  final IconData icon;
  final List<String> durations;
  final String? selectedDuration;
  final ValueChanged<String?> onDurationChanged;
  const BuildDropDownFiled({
    super.key,
    required this.value,
    required this.label,
    required this.icon,
    required this.durations,
    required this.onDurationChanged,
    this.selectedDuration,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: Colors.teal),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.teal, width: 2),
        ),
        filled: true,
        fillColor: Colors.grey.shade50,
      ),
      items: durations.map((String item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onDurationChanged,
    );
  }
}