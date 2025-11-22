import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

abstract class AuthLocalDataSource {
  Future<void> cacheToken(String token);
  Future<String?> getCachedToken();
  Future<void> clearToken();
  Future<bool> hasValidToken();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage secureStorage;
  AuthLocalDataSourceImpl(this.secureStorage);

  @override
  Future<void> cacheToken(String token) async {
    await secureStorage.write(key: 'token', value: token);
  }

  @override
  Future<void> clearToken() async {
    await secureStorage.delete(key: 'token');
  }

  @override
  Future<String?> getCachedToken() async {
    return await secureStorage.read(key: 'token');
  }

  @override
  Future<bool> hasValidToken() async {
    final token = await getCachedToken();

    if (token == null) return false;

    if (token.trim().isEmpty) return false;
    if (token == "null" || token == "undefined") return false;
    if (JwtDecoder.isExpired(token)) return false;

    return true;
  }
}
