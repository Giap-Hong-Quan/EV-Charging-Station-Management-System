import 'package:equatable/equatable.dart';
import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';

abstract class UserState extends Equatable {
  const UserState();

  @override
  List<Object?> get props => [];
}

class UserInitial extends UserState {}

class UserLoading extends UserState {}

class UserCreated extends UserState {
  final UserEntity user;

  const UserCreated(this.user);

  @override
  List<Object?> get props => [user];
}

class UsersLoaded extends UserState {
  final List<UserEntity> users; 
  const UsersLoaded(this.users);

  @override
  List<Object?> get props => [users];
}

class UserError extends UserState {
  final String message;

  const UserError(this.message);

  @override
  List<Object?> get props => [message];
}

class UserLoggedIn extends UserState {
  
  final UserEntity user;

  const UserLoggedIn(this.user);

  @override
  List<Object?> get props => [user];
}

class UserAuthenticated extends UserState {}
class UserUnauthenticated extends UserState {}

class UserProfileLoaded extends UserState {
  final UserEntity user;

  const UserProfileLoaded(this.user);

  @override
  List<Object?> get props => [user];
}
