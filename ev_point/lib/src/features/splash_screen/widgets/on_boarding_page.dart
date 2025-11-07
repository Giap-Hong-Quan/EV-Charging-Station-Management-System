import 'package:ev_point/src/features/splash_screen/widgets/on_boarding_data.dart';
import 'package:flutter/material.dart';

class OnboardingPage extends StatelessWidget {
  final OnboardingData data;
  const OnboardingPage({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        const SizedBox(height: 20),

        // Image UI (illustration)
        SizedBox(
          height: size.height * 0.45,
          child: Image.asset(
            data.imagePath,
            fit: BoxFit.contain,
          ),
        ),

        const SizedBox(height: 32),

        // Title
        Text(
          data.title,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 22,
            color: Colors.white,
            fontWeight: FontWeight.w700,
            height: 1.3,
          ),
        ),

        const SizedBox(height: 14),

        // Description
        Text(
          data.description,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withOpacity(0.85),
            height: 1.4,
          ),
        ),

        const SizedBox(height: 50),
      ]),
    );
  }
}
