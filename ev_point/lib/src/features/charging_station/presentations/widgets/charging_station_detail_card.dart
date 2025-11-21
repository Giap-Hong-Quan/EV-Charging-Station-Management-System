
import 'package:ev_point/src/features/charging_station/domain/entities/charging_station.dart';
import 'package:ev_point/src/features/charging_station/presentations/widgets/charging_station_card_info.dart';
import 'package:flutter/material.dart';

class ChargingStationDetailCard extends StatelessWidget {
  final ChargingStation chargingStation;
  const ChargingStationDetailCard({super.key, required this.chargingStation});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Navigate to station detail when card is tapped
       
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: Colors.grey[200]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        chargingStation.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              '${chargingStation.address} • Thời gian: ~5 phút',
                              style: TextStyle(
                                color: Colors.grey[500],
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color:
                        chargingStation.connectorType == 'Fast'
                            ? Colors.green[100]
                            : Colors.blue[100],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    chargingStation.connectorType,
                    style: TextStyle(
                      color:
                          chargingStation.connectorType == 'Fast'
                              ? Colors.green[700]
                              : Colors.blue[700],
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                ChargingStationCardInfo(
                  icon: Icons.bolt,
                  label: 'Tốc độ',
                  value: '${chargingStation.powerKw} kW',
                  color: Colors.yellow[700]!,
                ),
                ChargingStationCardInfo(
                  icon: Icons.battery_charging_full,
                  label: 'Có sẵn',
                  value: '${chargingStation.availablePoints}/${chargingStation.totalPoints}',
                  color: Colors.green[500]!,
                ),
                ChargingStationCardInfo(
                  icon: Icons.credit_card,
                  label: 'Giá',
                  value: '${chargingStation.pricePerKwh} VND/kWh',
                  color: Colors.blue[500]!,
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Handle directions
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Chỉ đường đến ${chargingStation.name}'),
                          backgroundColor: Colors.green[600],
                        ),
                      );
                    },
                    icon: const Icon(Icons.directions, color: Colors.white),
                    label: const Text(
                      'Chỉ đường',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue[600],
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 3,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Handle booking
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          title: const Text('Đặt chỗ'),
                          content: Text('Bạn có muốn đặt chỗ tại ${chargingStation.name}?'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Hủy'),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Đã đặt chỗ tại ${chargingStation.name}'),
                                    backgroundColor: Colors.green[600],
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green[600],
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: const Text('Xác nhận', style: TextStyle(color: Colors.white)),
                            ),
                          ],
                        ),
                      );
                    },
                    icon: const Icon(Icons.bookmark, color: Colors.white),
                    label: const Text(
                      'Đặt chỗ',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green[600],
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 3,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}