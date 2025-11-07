import 'dart:typed_data';
import 'package:ev_point/src/core/utils/extensions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';
import '../../../../core/constants/map_constants.dart';
import '../../domain/entities/station.dart';

class MapService {
  MapboxMap? _map;
  PointAnnotationManager? _annotationManager;
  final Map<String, Uint8List> _markerImageCache = {};
  final Map<String, Station> _annotationToStation = {};

  bool get isInitialized => _map != null && _annotationManager != null;

  Future<void> initialize(MapboxMap map) async {
    _map = map;
    await _map!.location.updateSettings(
      LocationComponentSettings(
        enabled: true,
        pulsingEnabled: true,
      ),
    );
    _annotationManager = await _map!.annotations.createPointAnnotationManager();
  }

  Future<void> renderStations(List<Station> stations) async {
    if (!isInitialized) return;

    await _annotationManager!.deleteAll();
    _annotationToStation.clear();

    if (stations.isEmpty) return;

    final options = <PointAnnotationOptions>[];
    for (final station in stations) {
      final imageBytes = await _loadMarkerImage(station.isOnline);

      options.add(
        PointAnnotationOptions(
          geometry: Point(
            coordinates: Position(station.longitude, station.latitude),
          ),
          image: imageBytes,
          iconSize: MapConstants.markerIconSize,
          textField: station.name,
          textOffset: MapConstants.markerTextOffset,
          textColor: Colors.black.value,
          textSize: MapConstants.markerTextSize,
          textHaloColor: Colors.white.value,
          textHaloWidth: MapConstants.markerTextHaloWidth,
        ),
      );
    }

    final annotations = await _annotationManager!.createMulti(options);
    for (int i = 0; i < annotations.length; i++) {
      final annotation = annotations[i];
      if (annotation != null) {
        _annotationToStation[annotation.id] = stations[i];
      }
    }
  }

  Future<Uint8List> _loadMarkerImage(bool isOnline) async {
    final key = isOnline ? 'pin_green' : 'pin_red';

    if (_markerImageCache.containsKey(key)) {
      return _markerImageCache[key]!;
    }

    final path = isOnline
        ? 'assets/logo/pin_green.png'
        : 'assets/logo/pin_red.png';
    final byteData = await rootBundle.load(path);
    final bytes = byteData.buffer.asUint8List();

    _markerImageCache[key] = bytes;
    return bytes;
  }

  Future<void> flyToStation(Station station) async {
    if (_map == null) return;

    await _map!.flyTo(
      CameraOptions(
        center: Point(
          coordinates: Position(station.longitude, station.latitude),
        ),
        zoom: MapConstants.detailZoom,
        pitch: MapConstants.defaultPitch,
        bearing: MapConstants.defaultBearing,
      ),
      MapAnimationOptions(duration: MapConstants.flyDuration),
    );
  }

  Future<void> flyToUserLocation(double longitude, double latitude) async {
    if (_map == null) return;

    await _map!.flyTo(
      CameraOptions(
        center: Point(coordinates: Position(longitude, latitude)),
        zoom: MapConstants.userLocationZoom,
        pitch: MapConstants.defaultPitch,
        bearing: MapConstants.defaultBearing,
      ),
      MapAnimationOptions(duration: MapConstants.userLocationDuration),
    );
  }

  Future<void> fitBoundsToStations(List<Station> stations) async {
    if (_map == null || stations.isEmpty) return;

    double minLat = stations.first.latitude;
    double maxLat = stations.first.latitude;
    double minLng = stations.first.longitude;
    double maxLng = stations.first.longitude;

    for (final station in stations.skip(1)) {
      if (station.latitude < minLat) minLat = station.latitude;
      if (station.latitude > maxLat) maxLat = station.latitude;
      if (station.longitude < minLng) minLng = station.longitude;
      if (station.longitude > maxLng) maxLng = station.longitude;
    }

    final bounds = CoordinateBounds(
      southwest: Point(coordinates: Position(minLng, minLat)),
      northeast: Point(coordinates: Position(maxLng, maxLat)),
      infiniteBounds: false,
    );

    final cameraOptions = await _map!.cameraForCoordinateBounds(
      bounds,
      MbxEdgeInsets(
        top: MapConstants.boundsPadding.top,
        bottom: MapConstants.boundsPadding.bottom,
        left: MapConstants.boundsPadding.left,
        right: MapConstants.boundsPadding.right,
      ),
      0.0,
      0.0,
      16.0,
      null,
    );

    await _map!.flyTo(
      cameraOptions,
      MapAnimationOptions(duration: MapConstants.fitBoundsDuration),
    );
  }

  Station? getStationByAnnotationId(String annotationId) {
    return _annotationToStation[annotationId];
  }

  void dispose() {
    _annotationManager?.deleteAll();
    _annotationManager = null;
    _map = null;
    _markerImageCache.clear();
    _annotationToStation.clear();
  }
}