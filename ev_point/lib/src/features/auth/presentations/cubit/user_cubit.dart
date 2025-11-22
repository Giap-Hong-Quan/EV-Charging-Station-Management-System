import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/features/auth/domain/usecase/get_current_profile_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/login_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/register_user.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class UserCubit extends Cubit<UserState> {
  final RegisterUserUC registerUserUC;
  final LoginUserUC loginUserUC;
  final GetCurrentProfileUserUC getCurrentProfileUserUC;
  final IUserRepository userRepository;

  UserCubit({
    required this.registerUserUC,
    required this.loginUserUC,
    required this.userRepository,
    required this.getCurrentProfileUserUC,
  }) : super(UserInitial());

  Future<void> checkTokenValidity() async {
    emit(UserLoading());
    try {
      final token = await userRepository.getSavedToken();
      if (token == null) {
        emit(UserUnauthenticated());
        return;
      }
      final isExpired = JwtDecoder.isExpired(token);
      if (isExpired) {
        emit(UserUnauthenticated());
      } else {
        emit(UserAuthenticated());
      }
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }

  Future<void> registerUser(RegisterRequestDto userDTO) async {
    emit(UserLoading());
    try {
      final registeredUser = await registerUserUC.call(userDTO);
      emit(UserCreated(registeredUser));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }

  Future<void> loginUser(String email, String password) async {
    emit(UserLoading());
    try {
      final loggedInUser = await loginUserUC.call(email, password);
      emit(UserLoggedIn(loggedInUser));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }

  Future<void> fetchCurrentProfileUser(String token) async {
    emit(UserLoading());
    try {
      final userProfile = await getCurrentProfileUserUC.call();
      emit(UserProfileLoaded(userProfile));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}

