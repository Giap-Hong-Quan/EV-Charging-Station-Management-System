import 'package:flutter/material.dart';

class BuildDetail extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const BuildDetail({super.key, required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
   return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey.shade600),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }
}