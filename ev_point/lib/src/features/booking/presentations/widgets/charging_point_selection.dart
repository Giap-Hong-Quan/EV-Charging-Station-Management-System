import 'package:ev_point/src/features/booking/presentations/widgets/error_box_selection_charging_point.dart';
import 'package:ev_point/src/features/booking/presentations/widgets/loading_skeleton.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ev_point/src/features/charging_point/domain/entities/charging_point.dart';
import '../../../charging_point/presentations/cubit/charging_point_cubit.dart';
import '../../../charging_point/presentations/cubit/charging_point_state.dart';

class ChargingPointSelection extends StatefulWidget {
  final String? chargingstationId;
  final void Function(ChargingPoint?)? onChanged;

  const ChargingPointSelection({
    super.key,
    this.chargingstationId,
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
    if (oldWidget.chargingstationId != widget.chargingstationId) {
      setState(() {
        _selectedIndex = null;
      });
      _loadChargingPoints();
    }
  }

  void _loadChargingPoints() {
    final cubit = context.read<ChargingPointCubit>();
    
    final stationId = widget.chargingstationId;
    
    if (stationId != null && stationId.trim().isNotEmpty) {
      cubit.loadChargingPointByStationId(stationId);
    } else {
      cubit.loadAllChargingPoint();
    }
  }

  bool _isPointAvailable(ChargingPoint point) {
    return point.pointStatus.toLowerCase() == 'empty';
  }

  void _showChargingPointSelector(List<ChargingPoint> chargingPoints) async {
    if (chargingPoints.isEmpty) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Không có điểm sạc nào khả dụng'),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }
    final availablePoints = chargingPoints.where(_isPointAvailable).toList();
    
    if (availablePoints.isEmpty && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Tất cả điểm sạc đang được sử dụng hoặc bảo trì'),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 2),
        ),
      );
    }

    if (!mounted) return;

    final pickedIndex = await showModalBottomSheet<int>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Chọn điểm sạc',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${availablePoints.length}/${chargingPoints.length} điểm sạc khả dụng',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 12),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: chargingPoints.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final point = chargingPoints[index];
                    final selected = index == _selectedIndex;
                    final isAvailable = _isPointAvailable(point);
                    
                    return ListTile(
                      onTap: isAvailable
                          ? () => Navigator.of(context).pop(index)
                          : () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Điểm ${point.pointNumber} đang ${_getStatusText(point.pointStatus)}',
                                  ),
                                  backgroundColor: Colors.orange,
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            },
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      enabled: isAvailable,
                      leading: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: !isAvailable
                              ? Colors.grey[200]
                              : selected
                                  ? const Color(0xFFE8F5E9)
                                  : Colors.grey[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          !isAvailable
                              ? Icons.lock_outline
                              : Icons.ev_station_outlined,
                          size: 24,
                          color: !isAvailable
                              ? Colors.grey[400]
                              : selected
                                  ? const Color(0xFF00C853)
                                  : Colors.grey[600],
                        ),
                      ),
                      title: Text(
                        'Điểm ${point.pointNumber}',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                          color: !isAvailable ? Colors.grey : Colors.black87,
                        ),
                      ),
                      subtitle: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: _getStatusColor(point.pointStatus),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _getStatusText(point.pointStatus),
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: _getStatusTextColor(point.pointStatus),
                              ),
                            ),
                          ),
                          if (!isAvailable) ...[
                            const SizedBox(width: 8),
                            Icon(
                              Icons.info_outline,
                              size: 14,
                              color: Colors.grey[500],
                            ),
                          ],
                        ],
                      ),
                      trailing: !isAvailable
                          ? Icon(
                              Icons.lock,
                              color: Colors.grey[400],
                              size: 20,
                            )
                          : selected
                              ? const Icon(
                                  Icons.check_circle,
                                  color: Color(0xFF00C853),
                                )
                              : Icon(
                                  Icons.chevron_right,
                                  color: Colors.grey[400],
                                ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );

    if (pickedIndex != null && mounted) {
      setState(() {
        _selectedIndex = pickedIndex;
      });
      
      if (widget.onChanged != null) {
        widget.onChanged!(chargingPoints[pickedIndex]);
      }
    }
  }

  String _getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'empty':
        return 'Trống';
      case 'charging':
        return 'Đang sạc';
      case 'reservation':
        return 'Đã đặt';
      case 'maintenance':
        return 'Bảo trì';
      case 'offline':
        return 'Offline';
      default:
        return status;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'empty':
        return Colors.green.shade50;
      case 'charging':
        return Colors.blue.shade50;
      case 'reservation':
        return Colors.orange.shade50;
      case 'maintenance':
        return Colors.red.shade50;
      case 'offline':
        return Colors.grey.shade100;
      default:
        return Colors.grey.shade50;
    }
  }

  Color _getStatusTextColor(String status) {
    switch (status.toLowerCase()) {
      case 'empty':
        return Colors.green.shade700;
      case 'charging':
        return Colors.blue.shade700;
      case 'reservation':
        return Colors.orange.shade700;
      case 'maintenance':
        return Colors.red.shade700;
      case 'offline':
        return Colors.grey.shade600;
      default:
        return Colors.grey.shade600;
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ChargingPointCubit, ChargingPointState>(
      builder: (context, state) {
        // Loading state
        if (state is ChargingPointLoading) {
          return const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Chọn điểm sạc',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              SizedBox(height: 12),
              LoadingSkeleton(),
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
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 12),
              ErrorBox(
                message: state.message,
                onRetry: _loadChargingPoints,
              ),
            ],
          );
        }

        // Loaded state
        final List<ChargingPoint> chargingPoints =
            state is ChargingPointLoaded ? state.chargingPoints : [];

        final availablePoints = chargingPoints.where(_isPointAvailable).toList();

        final hasSelection = _selectedIndex != null &&
            _selectedIndex! >= 0 &&
            _selectedIndex! < chargingPoints.length;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text(
                  'Chọn điểm sạc',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                if (chargingPoints.isNotEmpty) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: availablePoints.isEmpty
                          ? Colors.red.shade50
                          : Colors.green.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${availablePoints.length}/${chargingPoints.length} trống',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: availablePoints.isEmpty
                            ? Colors.red.shade700
                            : Colors.green.shade700,
                      ),
                    ),
                  ),
                ],
              ],
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
                    color: hasSelection
                        ? const Color(0xFF00C853)
                        : Colors.grey.shade300,
                    width: hasSelection ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: hasSelection
                            ? const Color(0xFFE8F5E9)
                            : Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        hasSelection
                            ? Icons.ev_station
                            : Icons.ev_station_outlined,
                        size: 28,
                        color: hasSelection
                            ? const Color(0xFF00C853)
                            : Colors.grey[600],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: hasSelection
                          ? Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Điểm ${chargingPoints[_selectedIndex!].pointNumber}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 4,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.green.shade50,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        _getStatusText(
                                          chargingPoints[_selectedIndex!].pointStatus,
                                        ),
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.green.shade700,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            )
                          : Text(
                              chargingPoints.isEmpty
                                  ? 'Không có điểm sạc khả dụng'
                                  : availablePoints.isEmpty
                                      ? 'Tất cả điểm đang bận'
                                      : 'Chọn điểm sạc (${availablePoints.length} trống)',
                              style: TextStyle(
                                fontSize: 15,
                                color: Colors.grey[600],
                              ),
                            ),
                    ),
                    Icon(
                      Icons.chevron_right,
                      color: Colors.grey[400],
                    ),
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


