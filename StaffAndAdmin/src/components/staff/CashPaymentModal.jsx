import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CashPaymentModal = ({ open, onOpenChange }) => {
  const [cashForm, setCashForm] = useState({
    sessionId: '',
    totalAmount: '',
    customerPaid: '',
    changeAmount: ''
  });

  const calculateChange = () => {
    const total = parseFloat(cashForm.totalAmount) || 0;
    const paid = parseFloat(cashForm.customerPaid) || 0;
    const change = paid - total;
    setCashForm({ ...cashForm, changeAmount: change >= 0 ? change : 0 });
  };

  const handleCashPayment = () => {
    console.log('Thu tiền mặt:', cashForm);
    onOpenChange(false);
    // Reset form
    setCashForm({
      sessionId: '',
      totalAmount: '',
      customerPaid: '',
      changeAmount: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            Thu tiền mặt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionId">Chọn phiên sạc</Label>
            <Select
              value={cashForm.sessionId}
              onValueChange={(value) => setCashForm({ ...cashForm, sessionId: value })}
            >
              <SelectTrigger id="sessionId">
                <SelectValue placeholder="-- Chọn phiên sạc --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S00123">S00123 - A01 (Chờ thanh toán)</SelectItem>
                <SelectItem value="S00124">S00124 - C01 (Chờ thanh toán)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="totalAmount">Số tiền cần thu</Label>
            <Input
              id="totalAmount"
              type="number"
              placeholder="128,250đ"
              value={cashForm.totalAmount}
              onChange={(e) => {
                setCashForm({ ...cashForm, totalAmount: e.target.value });
                calculateChange();
              }}
            />
          </div>

          <div>
            <Label htmlFor="customerPaid">Khách đưa</Label>
            <Input
              id="customerPaid"
              type="number"
              placeholder="200000"
              value={cashForm.customerPaid}
              onChange={(e) => {
                setCashForm({ ...cashForm, customerPaid: e.target.value });
                setTimeout(calculateChange, 100);
              }}
              onBlur={calculateChange}
            />
          </div>

          <div>
            <Label htmlFor="changeAmount">Tiền thừa trả lại</Label>
            <Input
              id="changeAmount"
              type="number"
              placeholder="0đ"
              value={cashForm.changeAmount}
              disabled
              className="bg-gray-50"
            />
          </div>

          {parseFloat(cashForm.customerPaid) < parseFloat(cashForm.totalAmount) && cashForm.customerPaid && (
            <Alert className="bg-yellow-50 border-yellow-300">
              <AlertDescription className="text-yellow-800 text-sm">
                ⚠️ Hãy kiểm tra kỹ số tiền trước khi xác nhận thanh toán
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700" 
            onClick={handleCashPayment}
            disabled={!cashForm.sessionId || !cashForm.totalAmount || !cashForm.customerPaid}
          >
            Xác nhận thanh toán
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CashPaymentModal;