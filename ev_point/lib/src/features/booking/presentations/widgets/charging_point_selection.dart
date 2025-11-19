// lib/src/features/charging_point/presentations/widgets/charging_point_selection.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';

import '../../../charging_point/presentations/cubit/charging_point_cubit.dart';
import '../../../charging_point/presentations/cubit/charging_point_state.dart';

class ChargingPointSelection extends StatefulWidget {
  final String? stationId;
  final void Function(ChargingPoint?)? onChanged;

  const ChargingPointSelection({
    super.key,
    this.stationId,
    this.onChanged,
  });

  @override
  State<ChargingPointSelection> createState() => _ChargingPointSelectionState();
}

class _ChargingPointSelectionState extends State<ChargingPointSelection> {
  int? _selectedIndex;

  @override
  void initState() {
    super.initState();
    _loadChargingPoints();
  }

  @override
  void didUpdateWidget(ChargingPointSelection oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Reload nếu stationId thay đổi
    if (oldWidget.stationId != widget.stationId) {
      setState(() {
        _selectedIndex = null; // Reset selection
      });
      _loadChargingPoints();
    }
  }

  void _loadChargingPoints() {
    // Load ngay trong initState, không cần PostFrameCallback
    final cubit = context.read<ChargingPointCubit>();
      
    if (widget.stationId != null && widget.stationId!.isNotEmpty) {
      cubit.loadChargingPointByStationId(widget.stationId!);
    } else {
      cubit.loadAllChargingPoint();
    }
  }

  void _showChargingPointSelector(List<ChargingPoint> chargingPoints) async {
    if (chargingPoints.isEmpty) {
      // Hiển thị thông báo không có charging point
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Không có điểm sạc nào khả dụng'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    final pickedIndex = await showModalBottomSheet<int>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Chọn điểm sạc',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: chargingPoints.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final p = chargingPoints[index];
                    final selected = index == _selectedIndex;
                    return ListTile(
                      onTap: () => Navigator.of(context).pop(index),
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: selected ? const Color(0xFFE8F5E9) : Colors.grey[200],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.ev_station_outlined,
                          size: 24,
                          color: selected ? const Color(0xFF00C853) : Colors.grey[600],
                        ),
                      ),
                      title: Text(
                        'Điểm ${p.pointNumber}',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      subtitle: Text(
                        'Trạng thái: ${p.pointStatus}',
                        style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                      ),
                      trailing: selected
                          ? const Icon(Icons.check_circle, color: Color(0xFF00C853))
                          : const Icon(Icons.chevron_right),
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );

    if (pickedIndex != null) {
      setState(() {
        _selectedIndex = pickedIndex;
      });
      if (widget.onChanged != null) {
        widget.onChanged!(chargingPoints[pickedIndex]);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ChargingPointCubit, ChargingPointState>(
      builder: (context, state) {
        // Loading state
        if (state is ChargingPointLoading) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Chọn điểm sạc',
                style: TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
              SizedBox(height: 12),
              _LoadingSkeleton(),
            ],
          );
        }

        // Error state
        if (state is ChargingPointError) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Chọn điểm sạc',
                style: TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
              const SizedBox(height: 12),
              _ErrorBox(
                message: state.message,
                onRetry: _loadChargingPoints,
              ),
            ],
          );
        }

        // Loaded or Initial
        final List<ChargingPoint> chargingPoints =
            state is ChargingPointLoaded ? state.chargingPoints : const [];


        final hasSelection = _selectedIndex != null &&
            _selectedIndex! >= 0 &&
            _selectedIndex! < chargingPoints.length;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Chọn điểm sạc',
              style: TextStyle(
                  fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 12),
            InkWell(
              onTap: () => _showChargingPointSelector(chargingPoints),
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: hasSelection ? const Color(0xFF00C853) : Colors.grey[200]!,
                    width: hasSelection ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: hasSelection ? const Color(0xFFE8F5E9) : Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        Icons.ev_station_outlined,
                        size: 28,
                        color: hasSelection ? const Color(0xFF00C853) : Colors.grey[600],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: hasSelection
                          ? Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Point ${chargingPoints[_selectedIndex!].pointNumber}',
                                  style: const TextStyle(
                                      fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Status: ${chargingPoints[_selectedIndex!].pointStatus}',
                                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                                ),
                              ],
                            )
                          : Text(
                              chargingPoints.isEmpty
                                  ? 'Không có điểm sạc'
                                  : 'Chọn điểm sạc (${chargingPoints.length} khả dụng)',
                              style: TextStyle(fontSize: 15, color: Colors.grey[600]),
                            ),
                    ),
                    Icon(Icons.chevron_right, color: Colors.grey[400]),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _LoadingSkeleton extends StatelessWidget {
  const _LoadingSkeleton();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: CircularProgressIndicator(
          strokeWidth: 2,
          color: Colors.grey[400],
        ),
      ),
    );
  }
}

class _ErrorBox extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorBox({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.red[200]!),
        color: Colors.red[50],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.red),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(color: Colors.red),
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 8),
          TextButton(
            onPressed: onRetry,
            child: const Text('Thử lại'),
          ),
        ],
      ),
    );
  }
}