import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateSessionModal = ({ open, onOpenChange }) => {
  const [sessionForm, setSessionForm] = useState({
    chargerId: '',
    vehicleType: '',
    licensePlate: '',
    phoneNumber: '',
    paymentMethod: 'cash'
  });

  const chargers = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02', 'C03', 'C04'];

  const handleCreateSession = () => {
    console.log('Tạo phiên sạc:', sessionForm);
    onOpenChange(false);
    // Reset form
    setSessionForm({
      chargerId: '',
      vehicleType: '',
      licensePlate: '',
      phoneNumber: '',
      paymentMethod: 'cash'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-6 h-6 text-emerald-600" />
            Tạo phiên sạc mới
          </DialogTitle>
        </DialogHeader>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800 text-sm">
            ℹ️ Dành cho khách hàng không sử dụng app hoặc thanh toán tại chỗ
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="chargerId">Chọn điểm sạc</Label>
            <Select
              value={sessionForm.chargerId}
              onValueChange={(value) => setSessionForm({ ...sessionForm, chargerId: value })}
            >
              <SelectTrigger id="chargerId">
                <SelectValue placeholder="-- Chọn điểm sạc --" />
              </SelectTrigger>
              <SelectContent>
                {chargers.map((charger) => (
                  <SelectItem key={charger} value={charger}>
                    Điểm sạc {charger}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicleType">Loại xe</Label>
            <Input
              id="vehicleType"
              placeholder="VD: VinFast VF8, Tesla Model 3..."
              value={sessionForm.vehicleType}
              onChange={(e) => setSessionForm({ ...sessionForm, vehicleType: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="licensePlate">Biển số xe</Label>
            <Input
              id="licensePlate"
              placeholder="VD: 29A-12345"
              value={sessionForm.licensePlate}
              onChange={(e) => setSessionForm({ ...sessionForm, licensePlate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Số điện thoại khách hàng (tùy chọn)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0912345678"
              value={sessionForm.phoneNumber}
              onChange={(e) => setSessionForm({ ...sessionForm, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Select
              value={sessionForm.paymentMethod}
              onValueChange={(value) => setSessionForm({ ...sessionForm, paymentMethod: value })}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tiền mặt</SelectItem>
                <SelectItem value="card">Thẻ ngân hàng</SelectItem>
                <SelectItem value="qr">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateSession}>
            Bắt đầu sạc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;