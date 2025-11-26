import 'package:ev_point/src/features/auth/domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  UserModel({
    required int id,
    required String email,
    String? password,
    required String fullname,
    String? address,
    int? roleId,
    String? avatar,
    String? token,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? role,
    String? stationId,
    Map<String, dynamic>? permissions,
  }) : super(
         id: id,
         email: email,
         password: password,
         fullname: fullname,
         address: address ?? '',
         roleId: roleId,
         role: role,
         stationId: stationId ?? '',
         permissions: permissions,
         avatar: avatar ?? '',
         createdAt: createdAt,
         updatedAt: updatedAt,
         token: token,
       );

  factory UserModel.fromJson(Map<String, dynamic> json) {
    String? roleName;
    Map<String, dynamic>? perms;

    if (json['role'] is Map<String, dynamic>) {
      final roleObj = json['role'] as Map<String, dynamic>;
      roleName = roleObj['role_name'] as String?;
      if (roleObj['permissions'] is Map<String, dynamic>) {
        perms = Map<String, dynamic>.from(roleObj['permissions']);
      }
    } else if (json['role'] is String) {
      roleName = json['role'] as String?;
    }

    return UserModel(
      id: json['id'],
      email: json['email'],
      password: json['password'] ?? '',
      fullname: json['fullName'] ?? json['full_name'] ?? '',
      address: json['address'] ?? '',
      roleId: json['role_id'],
      avatar: json['avatar'] ?? '',
      token: json['token'],
      createdAt:
          json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : null,
      updatedAt:
          json['updated_at'] != null
              ? DateTime.parse(json['updated_at'])
              : null,
      role: roleName,
      stationId: json['station_id']?.toString() ?? '',
      permissions: perms,
    );
  }

  factory UserModel.fromResponse(Map<String, dynamic> json) {
    if (json['errCode'] != 0) {
      throw Exception(json['message'] ?? 'Unknown error');
    }

    final userData = json['user'] as Map<String, dynamic>;
    if (json['token'] != null) {
      userData['token'] = json['token'];
    }

    return UserModel.fromJson(userData);
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'password': password,
      'full_name': fullname,
      'address': address,
      'role_id': roleId,
      'avatar': avatar,
      'token': token,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'role': role,
      'station_id': stationId,
      'permissions': permissions,
    };
  }

  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      email: entity.email,
      password: entity.password,
      fullname: entity.fullname,
      address: entity.address,
      roleId: entity.roleId,
      role: entity.role,
      stationId: entity.stationId,
      permissions: entity.permissions,
      avatar: entity.avatar,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      token: entity.token,
    );
  }

  UserModel copyWith({
    int? id,
    String? email,
    String? password,
    String? fullname,
    String? address,
    int? roleId,
    String? role,
    String? avatar,
    String? token,
    String? stationId,
    Map<String, dynamic>? permissions,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      email: email ?? this.email,
      password: password ?? this.password,
      fullname: fullname ?? this.fullname,
      address: address ?? this.address,
      roleId: roleId ?? this.roleId,
      role: role ?? this.role,
      avatar: avatar ?? this.avatar,
      token: token ?? this.token,
      stationId: stationId ?? this.stationId,
      permissions: permissions ?? this.permissions,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}