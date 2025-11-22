import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:ev_point/src/core/di/injection_container.dart';
import 'package:ev_point/src/features/auth/data/datasources/auth_local_datasources.dart';
import 'package:ev_point/src/core/routes/routers_path.dart';

class HeaderAppbar extends StatelessWidget implements PreferredSizeWidget {
  final String userName;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  const HeaderAppbar({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      flexibleSpace: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[600]!, Colors.teal[600]!],
          ),
        ),
      ),
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Greeting text
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Xin chào, $userName!',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Tìm trạm sạc gần bạn',
                style: TextStyle(color: Colors.green[100], fontSize: 14),
              ),
            ],
          ),

          // Avatar + menu
          PopupMenuButton<String>(
            offset: const Offset(0, 50),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            icon: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Icon(Icons.person, color: Colors.white, size: 22),
            ),
            onSelected: (value) async {
              if (value == 'profile') {
                context.push('/profile');
              }
              if (value == 'logout') {
                final authLocal = sl<AuthLocalDataSource>();
                await authLocal.clearToken();
                context.go(RouterPaths.loginScreen);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'profile',
                child: Row(
                  children: [
                    Icon(Icons.person, size: 20),
                    SizedBox(width: 10),
                    Text("Trang cá nhân"),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 20, color: Colors.red),
                    SizedBox(width: 10),
                    Text("Đăng xuất", style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      centerTitle: true,
    );
  }
}
