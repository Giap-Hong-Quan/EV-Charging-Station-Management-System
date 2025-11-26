// // lib/src/features/map/presentation/controllers/search_controller.dart
// import 'dart:async';
// import 'package:ev_point/src/core/utils/extensions.dart';
// import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
// import 'package:flutter/foundation.dart';
// import '../../../../core/constants/map_constants.dart';

// class StationSearchController extends ChangeNotifier {
//   List<ChargingStation> _allStations = [];
//   List<ChargingStation> _filteredStations = [];
//   String _currentQuery = '';
//   Timer? _debounceTimer;

//   List<ChargingStation> get filteredStations => _filteredStations;
//   bool get hasResults => _filteredStations.isNotEmpty;
//   bool get isSearching => _currentQuery.isNotEmpty;
//   String get currentQuery => _currentQuery;

//   void setAllStations(List<ChargingStation> stations) {
//     _allStations = stations;
//     _filteredStations = [];
//     _currentQuery = '';
//     notifyListeners();
//   }

//   void search(String query) {
//     _currentQuery = query.trim();
//     _debounceTimer?.cancel();

//     if (_currentQuery.isEmpty) {
//       _filteredStations = [];
//       notifyListeners();
//       return;
//     }

//     _debounceTimer = Timer(MapConstants.searchDebounce, () {
//       _performSearch(_currentQuery);
//     });
//   }

//   void _performSearch(String query) {
//     _filteredStations =
//         _allStations.where((station) {
//           return station.name.containsIgnoreCase(query) ||
//               station.address.containsIgnoreCase(query);
//         }).toList();
//     notifyListeners();
//   }

//   void filterByConnectorType(String connectorType) {
//     _filteredStations =
//         _allStations
//             .where((station) => station.connectorType == connectorType)
//             .toList();
//     _currentQuery = '';
//     notifyListeners();
//   }

//   void filterByStatus(String status) {
//     _filteredStations =
//         _allStations
//             .where(
//               (station) => station.status.toLowerCase() == status.toLowerCase(),
//             )
//             .toList();
//     _currentQuery = '';
//     notifyListeners();
//   }

//   void clearFilter() {
//     _filteredStations = [];
//     _currentQuery = '';
//     notifyListeners();
//   }

//   List<ChargingStation> getDisplayStations() {
//     return _filteredStations.isEmpty ? _allStations : _filteredStations;
//   }

//   @override
//   void dispose() {
//     _debounceTimer?.cancel();
//     super.dispose();
//   }
// }
