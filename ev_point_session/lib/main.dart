import 'package:ev_point_session/app.dart';
import 'package:ev_point_session/core/di/injection_container.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  await initDependencies();

  runApp(const MyApp());
}
