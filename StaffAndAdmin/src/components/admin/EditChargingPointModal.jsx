import { useState, useEffect } from "react";
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

export default function EditChargingPointModal({
  open,
  onOpenChange,
  point,
  stations = [],
  onUpdated,
}) {
  const [form, setForm] = useState({
    point_number: "",
    station_id: "",
    point_status: "",
  });

  useEffect(() => {
    if (point && open) {
      setForm({
        point_number: point.point_number,
        station_id: point.station_id,
        point_status: point.point_status,
      });
    }
  }, [point, open]);

  const handleSubmit = async () => {
    try {
      await pointService.updatePoint(point._id, form);

      toast.success("Đã cập nhật điểm sạc thành công");
      if (onUpdated) onUpdated();

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật");
    }
  };

  if (!point) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật điểm sạc</DialogTitle>
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
            />
          </div>

          {/* STATION */}
          <div>
            <Label>Trạm sạc</Label>
            <select
              className="w-full border rounded p-2"
              value={form.station_id}
              onChange={(e) => setForm({ ...form, station_id: e.target.value })}
            >
              {stations.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
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
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
