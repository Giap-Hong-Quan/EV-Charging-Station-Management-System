import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';

class LogoutUserUC {
  final IUserRepository userRepository;
  LogoutUserUC(this.userRepository);
  Future<void> call() async {
    return await userRepository.logoutUser();
  }
}

  