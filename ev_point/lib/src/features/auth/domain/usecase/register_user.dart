import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';

class RegisterUserUC {
  final IUserRepository userRepository;
  RegisterUserUC(this.userRepository);
  Future<UserEntity> call(RegisterRequestDto userDTO) async {
    return await userRepository.registerUser(userDTO);
  }
}