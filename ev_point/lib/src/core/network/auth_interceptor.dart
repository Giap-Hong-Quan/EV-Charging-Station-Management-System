import 'package:dio/dio.dart';
import 'package:ev_point/src/features/auth/data/datasources/auth_local_datasources.dart';

class AuthInterceptor extends Interceptor {
  final AuthLocalDataSource localDataSource;

  AuthInterceptor({required this.localDataSource});
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final skipAuth = options.extra['skipAuth'] == true;
    if (skipAuth) {
      return handler.next(options);
    }

    final token = await localDataSource.getCachedToken();

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }
}
