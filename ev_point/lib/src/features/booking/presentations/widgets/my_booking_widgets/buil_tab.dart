
import 'package:flutter/material.dart';

// ignore: must_be_immutable
class BuildTab extends StatelessWidget {
  final  String title;
  final bool isSelected;
  final VoidCallback onTap;
  const BuildTab({super.key, required this.title, required this.isSelected, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Text(
            title ,
            style: TextStyle(
              color: isSelected ? Colors.teal : Colors.grey,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          if (isSelected)
            Container(
              height: 3,
              width: 60,
              decoration: BoxDecoration(
                color: Colors.teal,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
        ],
      ),
    );
  }
}