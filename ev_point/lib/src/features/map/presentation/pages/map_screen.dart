import 'dart:async';
import 'dart:typed_data';

import 'package:ev_point/src/core/routes/routers_path.dart';
import 'package:ev_point/src/features/map/domain/entities/station.dart';
import 'package:ev_point/src/features/map/presentation/cubit/station/station_cubit.dart';
import 'package:ev_point/src/features/map/presentation/cubit/station/station_state.dart';
import 'package:ev_point/src/features/map/presentation/widgets/search_result.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart' as geo;
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart';

import '../../../booking/presentations/pages/booking_screen.dart';
import '../widgets/navigator_bar.dart';
import '../widgets/search_header.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  MapboxMap? _map;
  PointAnnotationManager? _annoMgr;

  int _tab = 0;
  bool _hasMovedToUserLocation = false;
  // FIX: Dùng lại StreamSubscription để quản lý vòng đời listener dễ dàng
  StreamSubscription<PointAnnotation>? _tapSub;

  // debounce search
  final _searchCtrl = TextEditingController();
  Timer? _debounce;

  // Dữ liệu
  List<Station> _allStations = [];
  List<Station> _filteredStations = [];
  final Map<String, Station> _annotationToStation = {};

  // FIX: Cache ảnh dưới dạng Uint8List
  final Map<String, Uint8List> _markerImageCache = {};

  // Cờ để đảm bảo các tiến trình không chạy chồng chéo
  bool _styleReady = false;
  bool _stationsReady = false;

  @override
  void initState() {
    super.initState();
    _ensurePermission().then((ok) {
      if (ok) _centerToMyLocation(); // Tự động di chuyển đến vị trí 1 lần
    });
    // Tải danh sách trạm sạc
    context.read<StationCubit>().load();
  }

  // ===== Permission & Location =====
  Future<bool> _ensurePermission() async {
    final enabled = await geo.Geolocator.isLocationServiceEnabled();
    var permission = await geo.Geolocator.checkPermission();
    if (permission == geo.LocationPermission.denied) {
      permission = await geo.Geolocator.requestPermission();
    }

    if (!enabled ||
        permission == geo.LocationPermission.deniedForever ||
        permission == geo.LocationPermission.denied) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Bạn cần bật GPS và cấp quyền vị trí.'),
            action: SnackBarAction(
              label: 'Cài đặt',
              onPressed: () => geo.Geolocator.openLocationSettings(),
            ),
          ),
        );
      }
      return false;
    }
    return true;
  }

  Future<void> _centerToMyLocation({bool userTriggered = false}) async {
    if (!userTriggered && _hasMovedToUserLocation) return;
    if (_map == null) return;
    try {
      final pos = await geo.Geolocator.getCurrentPosition(
        desiredAccuracy: geo.LocationAccuracy.high,
      );

      await _map!.location.updateSettings(
        LocationComponentSettings(enabled: true, pulsingEnabled: true),
      );

      await _map!.flyTo(
        CameraOptions(
          center: Point(coordinates: Position(pos.longitude, pos.latitude)),
          zoom: 15,
          pitch: 30,
          bearing: 0,
        ),
        MapAnimationOptions(duration: 800),
      );

      _hasMovedToUserLocation = true;
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Không lấy được vị trí: $e')));
    }
  }

  // ===== Map lifecycle =====
  Future<void> _onMapCreated(MapboxMap controller) async {
    _map = controller;
    await _map!.location.updateSettings(
      LocationComponentSettings(enabled: true, pulsingEnabled: true),
    );
    await _ensureAnnoMgr();
  }

  void _onStyleLoaded(StyleLoadedEventData _) {
    setState(() {
      _styleReady = true;
    });
    _tryDraw();
  }

  Future<void> _ensureAnnoMgr() async {
    if (_annoMgr != null) return;
    if (_map == null) return;
    _annoMgr = await _map!.annotations.createPointAnnotationManager();
    // Gán listener cho sự kiện nhấn vào marker
    // _tapSub = _annoMgr!.tapListener.stream.listen((annotation) {
    //   _onAnnotationTap(annotation);
    // });
  }

  Future<Uint8List> _loadMarkerBytes(bool isOnline) async {
    final key = isOnline ? 'pin_green' : 'pin_red';
    if (_markerImageCache.containsKey(key)) {
      return _markerImageCache[key]!;
    }

    final path =
        isOnline ? 'assets/logo/pin_green.png' : 'assets/logo/pin_red.png';
    final byteData = await rootBundle.load(path);
    final bytes = byteData.buffer.asUint8List();
    _markerImageCache[key] = bytes;
    return bytes;
  }

  Future<void> _renderStations(List<Station> stations) async {
    if (_map == null || _annoMgr == null) return;

    await _annoMgr!.deleteAll();
    _annotationToStation.clear();

    final opts = <PointAnnotationOptions>[];
    for (final s in stations) {
      final isOnline = s.status.toLowerCase() == 'online';
      // FIX: Lấy dữ liệu ảnh từ cache
      final imageBytes = await _loadMarkerBytes(isOnline);

      opts.add(
        PointAnnotationOptions(
          geometry: Point(coordinates: Position(s.longitude, s.latitude)),
          // FIX: Truyền Uint8List vào thuộc tính image
          image: imageBytes,
          iconSize: 1.0,
          textField: s.name,
          textOffset: const [0.0, 1.6],
          textColor: Colors.black.value,
          textSize: 11.0,
          textHaloColor: Colors.white.value,
          textHaloWidth: 1.0,
        ),
      );
    }

    final anns = await _annoMgr!.createMulti(opts);
    for (int i = 0; i < anns.length; i++) {
      _annotationToStation[anns[i]!.id] = stations[i];
    }

    if (_filteredStations.isNotEmpty) {
      await _fitToStations(stations);
    }
  }

  Future<void> _fitToStations(List<Station> stations) async {
    if (_map == null || stations.isEmpty) return;

    double minLat = stations.first.latitude, maxLat = stations.first.latitude;
    double minLng = stations.first.longitude, maxLng = stations.first.longitude;

    for (final s in stations.skip(1)) {
      if (s.latitude < minLat) minLat = s.latitude;
      if (s.latitude > maxLat) maxLat = s.latitude;
      if (s.longitude < minLng) minLng = s.longitude;
      if (s.longitude > maxLng) maxLng = s.longitude;
    }

    final bounds = CoordinateBounds(
      southwest: Point(coordinates: Position(minLng, minLat)),
      northeast: Point(coordinates: Position(maxLng, maxLat)),
      infiniteBounds: false,
    );

    final cam = await _map!.cameraForCoordinateBounds(
      bounds,
      MbxEdgeInsets(top: 120, bottom: 120, left: 60, right: 60),
      0.0,
      0.0,
      16.0,
      null,
    );

    await _map!.flyTo(cam, MapAnimationOptions(duration: 700));
  }

  // ===== Click marker =====
  void onAnnotationTap(PointAnnotation annotation) {
    final station = _annotationToStation[annotation.id];
    if (station != null) _showStationBottomSheet(station);
  }

  void _showStationBottomSheet(Station station) {
    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      builder:
          (context) => Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    _statusDot(station.status),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        station.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Text(
                      '${station.availablePoints}/${station.totalPoints} chỗ',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        station.address,
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _chip('Chuẩn: ${station.connectorType}'),
                    _chip('Công suất: ${station.powerKw} kW'),
                    _chip('Giá: ${_formatVND(station.pricePerKwh)} / kWh'),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: () async {
                          await _map?.flyTo(
                            CameraOptions(
                              center: Point(
                                coordinates: Position(
                                  station.longitude,
                                  station.latitude,
                                ),
                              ),
                              zoom: 16.5,
                              pitch: 0,
                              bearing: 0,
                            ),
                            MapAnimationOptions(duration: 600),
                          );
                          if (mounted) Navigator.pop(context);
                        },
                        icon: const Icon(Icons.map),
                        label: const Text('Đi tới'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        icon: const Icon(Icons.charging_station),
                        label: const Text('Chi tiết / Đặt chỗ'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
    );
  }

  Widget _statusDot(String status) {
    Color c;
    switch (status.toLowerCase()) {
      case 'online':
        c = Colors.green;
        break;
      case 'offline':
        c = Colors.red;
        break;
      default:
        c = Colors.orange;
    }
    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(color: c, shape: BoxShape.circle),
    );
  }

  Widget _chip(String text) =>
      Chip(label: Text(text), visualDensity: VisualDensity.compact);

  String _formatVND(num v) {
    final s = v.toInt().toString();
    final b = StringBuffer();
    for (int i = 0; i < s.length; i++) {
      final pos = s.length - i;
      b.write(s[i]);
      if (pos > 1 && pos % 3 == 1) b.write('.');
    }
    return '${b.toString()} đ';
  }

  // ===== Search & Filter =====
  void onSearchChanged(String q) {
    _debounce?.cancel();
    _debounce = Timer(
      const Duration(milliseconds: 300),
      () => _filterStations(q),
    );
  }

  void _filterStations(String query) {
    if (query.trim().isEmpty) {
      setState(() => _filteredStations = []);
      _renderStations(_allStations);
      return;
    }
    final filtered =
        _allStations.where((s) {
          final q = query.toLowerCase();
          return s.name.toLowerCase().contains(q) ||
              s.address.toLowerCase().contains(q);
        }).toList();

    setState(() => _filteredStations = filtered);
    _renderStations(filtered);
  }

  void _showFilterBottomSheet() {
    final connectorTypes =
        _allStations.map((s) => s.connectorType).toSet().toList();

    showModalBottomSheet(
      context: context,
      builder:
          (context) => Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Lọc trạm sạc',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _filteredStations = [];
                          _searchCtrl.clear();
                        });
                        _renderStations(_allStations);
                        Navigator.pop(context);
                      },
                      child: const Text('Xóa bộ lọc'),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  'Loại sạc:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children:
                      connectorTypes.map((type) {
                        return FilterChip(
                          label: Text(type),
                          onSelected: (selected) {
                            if (selected) {
                              final filtered =
                                  _allStations
                                      .where((s) => s.connectorType == type)
                                      .toList();
                              setState(() => _filteredStations = filtered);
                              _renderStations(filtered);
                              Navigator.pop(context);
                            }
                          },
                        );
                      }).toList(),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Trạng thái:',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children:
                      ['online', 'offline'].map((status) {
                        return FilterChip(
                          label: Text(
                            status == 'online'
                                ? 'Đang hoạt động'
                                : 'Không hoạt động',
                          ),
                          avatar: Icon(
                            Icons.circle,
                            size: 12,
                            color:
                                status == 'online' ? Colors.green : Colors.red,
                          ),
                          onSelected: (selected) {
                            if (selected) {
                              final filtered =
                                  _allStations
                                      .where(
                                        (s) => s.status.toLowerCase() == status,
                                      )
                                      .toList();
                              setState(() => _filteredStations = filtered);
                              _renderStations(filtered);
                              Navigator.pop(context);
                            }
                          },
                        );
                      }).toList(),
                ),
              ],
            ),
          ),
    );
  }

  void _tryDraw() {
    if (!_styleReady || !_stationsReady) return;
    final list = _filteredStations.isEmpty ? _allStations : _filteredStations;
    _renderStations(list);
  }

  // ===== Build =====
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          MapWidget(
            key: const ValueKey("map"),
            styleUri: MapboxStyles.MAPBOX_STREETS,
            cameraOptions: CameraOptions(
              center: Point(coordinates: Position(106.7004, 10.7769)),
              zoom: 12,
            ),
            onMapCreated: _onMapCreated,
            onStyleLoadedListener: _onStyleLoaded,
          ),
          BlocConsumer<StationCubit, StationState>(
            listenWhen:
                (prev, curr) =>
                    prev.error != curr.error ||
                    (prev.loading == true && curr.loading == false),
            buildWhen:
                (prev, curr) =>
                    prev.loading != curr.loading ||
                    prev.stations != curr.stations,
            listener: (context, state) {
              if (state.error != null) {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(SnackBar(content: Text('Lỗi: ${state.error}')));
                return;
              }
              
              if (!state.loading && state.stations.isNotEmpty) {
                setState(() {
                  _allStations = state.stations;
                  _filteredStations = [];
                  _stationsReady = true;
                });
                _tryDraw();
              }
            },
            builder: (context, state) {
              if (state.loading) {
                return Container(
                  color: Colors.black.withOpacity(0.2),
                  child: const Center(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircularProgressIndicator(),
                            SizedBox(height: 16),
                            Text('Đang tải trạm sạc...'),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),
          Positioned(
            left: 0,
            right: 0,
            top: 20,
            child: SearchHeader(
              controller: _searchCtrl,
              onFilterTap: _showFilterBottomSheet,
              cubit: context.read<StationCubit>(),
            ),
          ),

          if (_searchCtrl.text.trim().isNotEmpty)
            Positioned(
              left: 16,
              right: 16,
              top: 80,
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.75,
                ),
                child: Material(
                  borderRadius: BorderRadius.circular(14),
                  elevation: 8,
                  clipBehavior: Clip.antiAlias,
                  child: SearchResult(
                    onStationTap: (st) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => BookingScreen(station: st),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
          Positioned(
            top: 80,
            left: 16,
            child: BlocBuilder<StationCubit, StationState>(
              builder: (context, state) {
                if (state.stations.isEmpty) return const SizedBox.shrink();
                final count =
                    _filteredStations.isEmpty
                        ? state.stations.length
                        : _filteredStations.length;
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.ev_station,
                        size: 16,
                        color: Colors.green,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$count trạm',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Positioned(
            bottom: 100,
            right: 16,
            child: FloatingActionButton(
              onPressed: () => _centerToMyLocation(userTriggered: true),
              backgroundColor: Colors.white,
              child: const Icon(Icons.my_location, color: Colors.blue),
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: NavigatorBar(
                currentIndex: _tab,
                onTap: (i) {
                  setState(() {
                    _tab = i;
                  });
                  switch (i) {
                    case 0:
                      context.go(RouterPaths.mapScreen);
                      break;
                    case 2:
                      context.go(RouterPaths.myBookingScreen);
                      break;
                    case 3:
                      context.go(RouterPaths.mapScreen);
                      break;
                    case 4:
                      context.go(RouterPaths.mapScreen);
                      break;
                    default:
                      context.go(RouterPaths.mapScreen);

                  }
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ===== Dispose =====
  @override
  void dispose() {
    // FIX: Hủy đăng ký listener và dọn dẹp tài nguyên
    _tapSub?.cancel();
    _annoMgr?.deleteAll();
    _annoMgr = null;
    _map = null;
    _searchCtrl.dispose();
    _debounce?.cancel();
    super.dispose();
  }
}
