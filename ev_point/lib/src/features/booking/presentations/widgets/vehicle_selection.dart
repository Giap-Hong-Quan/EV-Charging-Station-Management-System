import 'package:flutter/material.dart';

class VehicleSelection extends StatefulWidget {
  final ValueChanged<Map<String, String>>? onVehicleChanged;
  
  const VehicleSelection({
    super.key,
    this.onVehicleChanged,
  });

  @override
  State<VehicleSelection> createState() => _VehicleSelectionState();
}

class _VehicleSelectionState extends State<VehicleSelection> {
  final TextEditingController _vehicleNameController = TextEditingController();
  final TextEditingController _licensePlateController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  bool _isExpanded = false;

  @override
  void dispose() {
    _vehicleNameController.dispose();
    _licensePlateController.dispose();
    super.dispose();
  }

  void _saveVehicle() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isExpanded = false;
      });
      
      widget.onVehicleChanged?.call({
        'vehicleName': _vehicleNameController.text,
        'licensePlate': _licensePlateController.text,
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Thông tin xe đã được lưu'),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Thông tin xe',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 12),
        
        // Collapsed view - Show saved vehicle info
        if (!_isExpanded && _vehicleNameController.text.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey[200]!),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.electric_car,
                    size: 28,
                    color: Colors.green[600],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _vehicleNameController.text,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _licensePlateController.text,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _isExpanded = true;
                    });
                  },
                  icon: Icon(Icons.edit_outlined, color: Colors.grey[600]),
                ),
              ],
            ),
          ),

        // Expanded view - Form to input vehicle info
        if (_isExpanded || _vehicleNameController.text.isEmpty)
          Form(
            key: _formKey,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vehicle Name Input
                  TextFormField(
                    controller: _vehicleNameController,
                    decoration: InputDecoration(
                      labelText: 'Tên xe',
                      hintText: 'VD: Tesla Model 3, VinFast VF8...',
                      prefixIcon: const Icon(Icons.directions_car),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập tên xe';
                      }
                      return null;
                    },
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // License Plate Input
                  TextFormField(
                    controller: _licensePlateController,
                    decoration: InputDecoration(
                      labelText: 'Biển số xe',
                      hintText: 'VD: 29A-12345',
                      prefixIcon: const Icon(Icons.pin),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    textCapitalization: TextCapitalization.characters,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Vui lòng nhập biển số xe';
                      }
                      // Basic validation for Vietnamese license plate format
                      final regex = RegExp(r'^\d{2}[A-Z]-\d{4,5}$');
                      if (!regex.hasMatch(value)) {
                        return 'Định dạng: 29A-12345';
                      }
                      return null;
                    },
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Action Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (_vehicleNameController.text.isNotEmpty)
                        TextButton(
                          onPressed: () {
                            setState(() {
                              _isExpanded = false;
                            });
                          },
                          child: const Text('Hủy'),
                        ),
                      const SizedBox(width: 8),
                      FilledButton(
                        onPressed: _saveVehicle,
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF00C853),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                        ),
                        child: const Text('Lưu thông tin'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}