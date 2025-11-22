import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';
import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';

abstract class IUserRepository {
  Future<UserEntity> registerUser(RegisterRequestDto userDTO);
  Future<UserEntity> loginUser(String email, String password);
  Future<UserEntity> getCurrentProfileUser();
  Future<void> logoutUser();

  Future<bool> hasValidToken();
  Future<String?> getSavedToken();

} 