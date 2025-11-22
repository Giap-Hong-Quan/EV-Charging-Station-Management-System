import 'package:flutter/material.dart';

class HeaderAppbar extends StatelessWidget implements PreferredSizeWidget{
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
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Xin chào, $userName!',
                style: TextStyle(
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
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(50),
            ),
            child: const Icon(Icons.person, color: Colors.white, size: 22),
          ),
        ],
      ),
      centerTitle: true,
    );
  }
}
