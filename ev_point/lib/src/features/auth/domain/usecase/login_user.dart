import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';

class LoginUserUC {
  final IUserRepository userRepository;

  LoginUserUC(this.userRepository);

  Future<UserEntity> call(String email, String password) {
    return userRepository.loginUser(email, password);
  }
}