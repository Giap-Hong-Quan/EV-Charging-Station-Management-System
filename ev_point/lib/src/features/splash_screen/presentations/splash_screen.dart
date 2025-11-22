import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/core/services/oboarding_pref.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/core/di/injection_container.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late final IUserRepository _userRepository = sl<IUserRepository>();

  @override
  void initState() {
    super.initState();
    _handleSetup();
  }

  Future<void> _handleSetup() async {
    await Future.delayed(const Duration(milliseconds: 800));

    final seen = await OnboardingPref.hasSeenOnboarding();
    if (!seen) {
      if (!mounted) return;
      context.go(RouterPaths.onboardingScreen);
      return;
    }

    final hasValidToken = await _userRepository.hasValidToken();
    if (!mounted) return;

    if (hasValidToken) {
      context.go(RouterPaths.homeScreen);
    } else {
      context.go(RouterPaths.loginScreen);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF00D68F),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(60),
              ),
              child: Image.asset('assets/logo/image.png'),
            ),
            const SizedBox(height: 30),
            const Text(
              'EV Point',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 100),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
