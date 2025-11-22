import 'package:ev_point/src/features/auth/data/datasources/auth_local_datasources.dart';
import 'package:ev_point/src/features/auth/data/datasources/user_remote_datasources.dart';
import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';
import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';

class UserRepositoryImpl implements IUserRepository {
  final UserRemoteDatasources remoteDatasources;
  final AuthLocalDataSource localDataSource;
  
  UserRepositoryImpl(this.remoteDatasources, this.localDataSource);

  @override
  Future<UserEntity> registerUser(RegisterRequestDto userDTO) {
    return remoteDatasources.registerUser(userDTO);
  }
  
  @override
  Future<UserEntity> loginUser(String email, String password) async {
    final response = await remoteDatasources.loginUser(email, password);
    await localDataSource.cacheToken(response.token ?? '');
    print('Token saved: ${response.token}');
    return response;
  }

  @override
  Future<UserEntity> getCurrentProfileUser() {
    return remoteDatasources.getCurrentProfileUser();
  }

  @override
  Future<void> logoutUser() async { 
    await remoteDatasources.logoutUser(); 
    await localDataSource.clearToken();
  }

    @override
  Future<String?> getSavedToken() async {
    return await localDataSource.getCachedToken();
  }

  @override
  Future<bool> hasValidToken() async {
    return await localDataSource.hasValidToken();
  }


}
