class RegisterRequestDto {
  final String fullName;
  final String email;
  final String password;
  RegisterRequestDto({
    required this.fullName,
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() => {
    "fullName": fullName,
    "email": email,
    "password": password,
  };
}
