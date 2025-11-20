import 'package:ev_point/src/app.dart';
import 'package:ev_point/src/core/di/injection_container.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Future.delayed(const Duration(milliseconds: 1200)); 
  await dotenv.load(fileName: ".env");
  await initDependencies();
  FlutterNativeSplash.remove();

  runApp(const MyApp());
}

