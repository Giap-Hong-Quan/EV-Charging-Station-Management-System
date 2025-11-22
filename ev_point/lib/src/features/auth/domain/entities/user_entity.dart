class UserEntity {
  final int id;
  final String email;
  final String? password;
  final String fullname;
  final String? address;
  final int? roleId;
  final String? role;                
  final String? stationId;
  final Map<String, dynamic>? permissions; 
  final String? avatar;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final String? token;
  UserEntity({
    required this.id,
    required this.email,
    this.password,
    required this.fullname,
    this.address,
    this.roleId,
    this.role,
    this.stationId,
    this.permissions,
    this.avatar,
    this.createdAt,
    this.updatedAt,
    this.token,
  });
}
