import 'package:flutter/material.dart';

class BuildSelectionTitle extends StatelessWidget {
  final String title;
  const BuildSelectionTitle({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(  
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.teal,
      ),
    );
  }
}