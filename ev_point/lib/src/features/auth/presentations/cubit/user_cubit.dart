import 'package:ev_point/src/features/auth/data/dto/register_request_dto.dart';
import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';
import 'package:ev_point/src/features/auth/domain/repositories/user_repository.dart';
import 'package:ev_point/src/features/auth/domain/usecase/get_current_profile_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/login_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/logout_user.dart';
import 'package:ev_point/src/features/auth/domain/usecase/register_user.dart';
import 'package:ev_point/src/features/auth/presentations/cubit/user_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class UserCubit extends Cubit<UserState> {
  final RegisterUserUC registerUserUC;
  final LoginUserUC loginUserUC;
  final GetCurrentProfileUserUC getCurrentProfileUserUC;
  final LogoutUserUC logoutUserUC;
  final IUserRepository userRepository;

  UserCubit({
    required this.registerUserUC,
    required this.loginUserUC,
    required this.userRepository,
    required this.logoutUserUC,
    required this.getCurrentProfileUserUC,
  }) : super(UserInitial());

  UserEntity? get currentUser {
    final s = state;
    if (s is UserLoggedIn) {
      return s.user;
    }
    if (s is UserProfileLoaded) {
      return s.user;
    }
    if(s is UserCreated) {
      return s.user;
    } 
    return null;
  }

Future<void> loadCurrentUser() async {
    if (currentUser != null && state is UserProfileLoaded) {
      return;
    }
    if (state is UserInitial) {
      emit(UserLoading());
    }

    try {
      final userProfile = await getCurrentProfileUserUC.call();
      emit(UserProfileLoaded(userProfile));
    } catch (e) {
      emit(UserUnauthenticated());
    }
  }

  Future<void> checkTokenValidity() async {
  emit(UserLoading());
  try {
    final token = await userRepository.getSavedToken();
    if (token == null || JwtDecoder.isExpired(token)) {
      emit(UserUnauthenticated());
      return;
    }

    final userProfile = await getCurrentProfileUserUC.call();
    emit(UserProfileLoaded(userProfile));
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

  void logoutUser() async {
    emit(UserLoading());
    try {
      await logoutUserUC.call();
      emit(UserUnauthenticated());
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}

