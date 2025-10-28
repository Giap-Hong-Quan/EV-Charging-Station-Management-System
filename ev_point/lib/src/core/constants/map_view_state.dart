class MapViewState {
  final bool isMapReady;
  final bool isDataReady;
  final bool isSearchVisible;

  MapViewState({
    required this.isMapReady,
    required this.isDataReady,
    required this.isSearchVisible,
  });

  bool get canRenderMarkers => isMapReady && isDataReady;
}
