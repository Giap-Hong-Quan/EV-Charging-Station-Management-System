import 'package:geolocator/geolocator.dart' as geo;

class GetUserLocation {
  Future<geo.Position> call() async {
    final enabled = await geo.Geolocator.isLocationServiceEnabled();
    if (!enabled) throw Exception('Hãy bật dịch vụ vị trí.');

    var perm = await geo.Geolocator.checkPermission();
    if (perm == geo.LocationPermission.denied) {
      perm = await geo.Geolocator.requestPermission();
    }
    if (perm == geo.LocationPermission.denied ||
        perm == geo.LocationPermission.deniedForever) {
      throw Exception('Ứng dụng cần quyền vị trí.');
    }
    return geo.Geolocator.getCurrentPosition(
        desiredAccuracy: geo.LocationAccuracy.best);
  }
}
