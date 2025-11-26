import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { pointService } from "@/services/pointService";
import { toast } from "sonner";
import { Building, Zap } from "lucide-react";

export default function AddChargingPointModal({
  open,
  onOpenChange,
  stations = [],
  onCreated,
}) {
  const [form, setForm] = useState({
    point_number: "",
    station_id: "",
    point_status: "Empty",
  });

  const handleSubmit = async () => {
    try {
      await pointService.createPoint(form);
      toast.success("Đã thêm điểm sạc thành công");

      if (onCreated) onCreated();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm điểm sạc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm điểm sạc</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">

          {/* POINT NUMBER */}
          <div>
            <Label>Số điểm sạc</Label>
            <Input
              type="number"
              value={form.point_number}
              onChange={(e) =>
                setForm({ ...form, point_number: e.target.value })
              }
              placeholder="VD: 1"
            />
          </div>

          {/* STATION DROPDOWN */}
          <div>
            <Label>Trạm sạc</Label>
            <div className="relative">
              <select
                className="w-full border rounded p-2"
                value={form.station_id}
                onChange={(e) => setForm({ ...form, station_id: e.target.value })}
              >
                <option value="">-- Chọn trạm --</option>

                {stations.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <Label>Trạng thái</Label>
            <select
              className="w-full border rounded p-2"
              value={form.point_status}
              onChange={(e) =>
                setForm({ ...form, point_status: e.target.value })
              }
            >
              <option value="Empty">Trống</option>
              <option value="Charging">Đang sạc</option>
              <option value="Reservation">Đã đặt</option>
              <option value="Maintenance">Bảo trì</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={handleSubmit}
            >
              Thêm điểm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
