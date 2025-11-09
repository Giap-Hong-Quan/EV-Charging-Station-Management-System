import 'package:flutter/material.dart';

/// Reusable toggle widget (stateless, controlled)
class BuildToggleButton extends StatelessWidget {
  final bool isManualInput;
  final ValueChanged<bool> onChanged;

  const BuildToggleButton({
    super.key,
    required this.isManualInput,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.teal,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Row(
        children: [
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () => onChanged(true),
              icon: const Icon(Icons.edit),
              label: const Text('Nhập thông tin'),
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    isManualInput ? Colors.white : Colors.teal.shade700,
                foregroundColor:
                    isManualInput ? Colors.teal : Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                elevation: isManualInput ? 3 : 0,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton.icon(
              onPressed: () => onChanged(false),
              icon: const Icon(Icons.qr_code_scanner),
              label: const Text('Quét mã QR'),
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    !isManualInput ? Colors.white : Colors.teal.shade700,
                foregroundColor:
                    !isManualInput ? Colors.teal : Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                elevation: !isManualInput ? 3 : 0,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
