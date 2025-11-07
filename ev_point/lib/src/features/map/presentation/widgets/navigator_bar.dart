import 'package:flutter/material.dart';
import 'nav_item.dart';

class NavigatorBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final EdgeInsets margin;

  const NavigatorBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.margin = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  });

  static const _active = Color(0xFF00C853);
  static const _inactive = Colors.black54;

  @override
  Widget build(BuildContext context) {
    const items = <NavItem>[
      NavItem(icon: Icons.home_filled, label: 'Home'),
      NavItem(icon: Icons.search, label: 'Search'),
      NavItem(icon: Icons.event_available_outlined, label: 'My Booking'),
      NavItem(icon: Icons.account_balance_wallet_outlined, label: 'My Wallet'),
      NavItem(icon: Icons.person_outline, label: 'Account'),
    ];

    return SafeArea(
      minimum: EdgeInsets.only(bottom: margin.bottom),
      child: Container(
        margin: EdgeInsets.only(left: margin.left, right: margin.right),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              blurRadius: 18,
              offset: const Offset(0, 6),
              color: Colors.black.withOpacity(.12),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(items.length, (i) {
            final item = items[i];
            final active = i == currentIndex;
            return GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => onTap(i),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(item.icon, color: active ? _active : _inactive),
                  const SizedBox(height: 4),
                  Text(
                    item.label,
                    style: TextStyle(
                      fontSize: 12,
                      color: active ? _active : _inactive,
                      fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                    ),
                  ),
                ],
              ),
            );
          }),
        ),
      ),
    );
  }
}
