import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import { paymentService } from "@/services/paymentService";
import { chargingSessionService } from "@/services/chargingSessionService";
import { pointService } from "@/services/pointService";

const CashPaymentModal = ({ open, onOpenChange, session }) => {
  const [cashForm, setCashForm] = useState({
    sessionId: "",
    totalAmount: "",
    customerPaid: "",
    changeAmount: "",
  });

  // Load session khi modal mở
  useEffect(() => {
    if (session) {
      setCashForm({
        sessionId: session._id,
        totalAmount: session.total_price || 0,
        customerPaid: "",
        changeAmount: 0,
      });
    }
  }, [session]);

  const calculateChange = () => {
    const total = Number(cashForm.totalAmount);
    const paid = Number(cashForm.customerPaid);
    const change = paid - total;

    setCashForm((f) => ({
      ...f,
      changeAmount: change > 0 ? change : 0,
    }));
  };

  // ============================
  // XỬ LÝ THANH TOÁN COD
  // ============================
  const handleCashPayment = async () => {
    try {
      if (!cashForm.customerPaid || cashForm.customerPaid < cashForm.totalAmount) {
        return toast.error("Khách đưa chưa đủ tiền!");
      }

      toast.loading("Đang xử lý thanh toán...");

      // 1 GỌI API TẠO THANH TOÁN
      const res = await paymentService.createPayment({
        sessionId: session._id,
        userId: session.user_id || null,
        stationId: session.station_id,
        amount: session.total_price, // TIỀN PHẢI THU
        method: "COD",
      });

      toast.dismiss();
      toast.success("Thanh toán thành công!");

      const paymentId =
        res.paymentId || res.data?.paymentId || res.data?.payment?.paymentId;

      // 2 CẬP NHẬT TRẠNG THÁI THANH TOÁN CHO PHIÊN SẠC
      await chargingSessionService.updateSessionPayment(session._id, {
        payment_status: "paid",
      payment_method: "cash",
      });
      await pointService.updatePointStatus(session.point_id, {
        point_status: "Empty",
      });
      //  ĐÓNG MODAL
      onOpenChange(false);

      //  Refresh bên ngoài nếu cần
      if (typeof session.onPaid === "function") {
        session.onPaid(paymentId);
      }

    } catch (err) {
      toast.dismiss();
      toast.error("Thanh toán thất bại!");
      console.error(err);
    }
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

          {/* Mã phiên */}
          <div>
            <Label>Phiên sạc</Label>
            <p className="font-mono text-sm bg-slate-100 px-3 py-2 rounded">
              #{session?.session_code}
            </p>
          </div>

          {/* Số tiền cần thu */}
          <div>
            <Label>Số tiền cần thu</Label>
            <Input
              value={cashForm.totalAmount}
              disabled
              className="bg-gray-100"
            />
          </div>

          {/* KH đưa bao nhiêu */}
          <div>
            <Label>Khách đưa</Label>
            <Input
              type="number"
              value={cashForm.customerPaid}
              onChange={(e) => {
                setCashForm({ ...cashForm, customerPaid: e.target.value });
                setTimeout(calculateChange, 20);
              }}
            />
          </div>

          {/* Tiền thừa */}
          <div>
            <Label>Tiền thừa trả lại</Label>
            <Input
              disabled
              value={cashForm.changeAmount}
              className="bg-gray-100"
            />
          </div>
        </div>

        {/* Nút */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleCashPayment}
          >
            Xác nhận thanh toán
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default CashPaymentModal;
