import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';

class GetCurrentProfileUserUC {
  final IUserRepository userRepository;

  GetCurrentProfileUserUC(this.userRepository);

  Future<UserEntity> call() async {
    return await userRepository.getCurrentProfileUser();
  }
}