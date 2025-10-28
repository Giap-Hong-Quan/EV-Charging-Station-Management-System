import 'package:flutter/material.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

class MapConstants {
  // Camera settings
  static const double defaultZoom = 12.0;
  static const double detailZoom = 16.5;
  static const double userLocationZoom = 15.0;
  static const double defaultPitch = 30.0;
  static const double defaultBearing = 0.0;

  // Animation durations
  static const int flyDuration = 600;
  static const int userLocationDuration = 800;
  static const int fitBoundsDuration = 700;

  // Padding
  static const EdgeInsets boundsPadding = EdgeInsets.only(
    top: 120,
    bottom: 120,
    left: 60,
    right: 60,
  );

  // Search
  static const Duration searchDebounce = Duration(milliseconds: 300);
  static const double searchResultsMaxHeightRatio = 0.75;

  // Marker
  static const double markerIconSize = 1.0;
  static const List<double> markerTextOffset = [0.0, 1.6];
  static const double markerTextSize = 11.0;
  static const double markerTextHaloWidth = 1.0;

  // Default camera
  static CameraOptions get defaultCameraOptions => CameraOptions(
    center: Point(
      coordinates: Position(106.7004, 10.7769), // Ho Chi Minh City
    ),
    zoom: defaultZoom,
  );
}