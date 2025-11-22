import 'dart:io';

import 'package:dio/dio.dart';
import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';
import 'package:ev_point/src/features/auth/data/models/user_model.dart';

abstract class UserRemoteDatasources {
  Future<UserModel> registerUser(RegisterRequestDto userDTO);
  Future<UserModel> loginUser(String email, String password);
  Future<UserModel> getCurrentProfileUser();
  Future<void> logoutUser();
}

class UserRemoteDatasourcesImpl implements UserRemoteDatasources {
  final Dio dio;
  final String gatewayUrl;
  UserRemoteDatasourcesImpl({required this.dio, required this.gatewayUrl});
  @override
  Future<UserModel> registerUser(RegisterRequestDto userDTO) async {
    try{
      final response = await dio.post(
        '/user-service/auth/register',
        data: userDTO.toJson(),
        options: Options(
          extra: {'skipAuth': true},
          headers: {HttpHeaders.contentTypeHeader: 'application/json'},
        ),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return UserModel.fromResponse(response.data as Map<String, dynamic>);
      } else {
        throw Exception('Registration failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        final message = e.response?.data['message'] ?? 'Lỗi không xác định';
        throw Exception(message);
      }
      throw Exception('Không thể kết nối server');
    }
  }
  
  @override
  Future<UserModel> loginUser(String email, String password) async {
    try{
      final response = await dio.post(
        '/user-service/auth/login',
        data: {
          'email': email,
          'password': password,
        },
        options: Options(
          extra: {'skipAuth': true},
          headers: {HttpHeaders.contentTypeHeader: 'application/json'},
        ),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return UserModel.fromResponse(response.data as Map<String, dynamic>);
      } else {
        throw Exception('Login failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        final message = e.response?.data['message'] ?? 'Lỗi không xác định';
        throw Exception(message);
      }
      throw Exception('Không thể kết nối server');
    }
  }

  @override
  Future<UserModel> getCurrentProfileUser() async {
    try {
      final response = await dio.get(
        '/user-service/profile',
        options: Options(
          headers: {HttpHeaders.contentTypeHeader: 'application/json'},
        ),
      );
      if (response.statusCode == 200) {
        return UserModel.fromResponse(response.data as Map<String, dynamic>);
      } else {
        throw Exception('Failed to load user profile: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        final message = e.response?.data['message'] ?? 'Lỗi không xác định';
        throw Exception(message);
      }
      throw Exception('Không thể kết nối server');
    }
  }

  @override
  Future<void> logoutUser() async {
    try{
      await dio.post(
        '/user-service/auth/logout',
        options: Options(
          headers: {HttpHeaders.contentTypeHeader: 'application/json'},
        ),
      );
    } on DioException catch (e) {
      if (e.response != null) {
        final message = e.response?.data['message'] ?? 'Lỗi không xác định';
        throw Exception(message);
      }
      throw Exception('Không thể kết nối server');
    }
    return;
  }
}
