import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';


import { chargingSessionService } from '@/services/chargingSessionService';
import { pointService } from '@/services/pointService';

// Decode JWT
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const CreateSessionModal = ({ open, onOpenChange, onCreated }) => {
  const user = getUserFromToken();
  const stationId = user?.station_id;
  const staffOperation = user?.user_id;

  const [pointList, setPointList] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);

  const [sessionForm, setSessionForm] = useState({
    point_id: "",
    vehicle_name: "",
    vehicle_number: "",
    start_soc_percent: 10,
  });

  // ==========================
  // 1️⃣ Load danh sách điểm sạc theo stationId
  // ==========================
  useEffect(() => {
    const loadPoints = async () => {
      try {
        if (!stationId) {
          toast.error("Không tìm thấy station_id trong token");
          return;
        }

        setLoadingPoints(true);

        const res = await pointService.getPointsByStationId(stationId);
        console.log("Points loaded:", res.points);
        // res: {success: true, data: [...]}

        setPointList(res.points);
      } catch (err) {
        toast.error("Không tải được danh sách điểm sạc",err);
      } finally {
        setLoadingPoints(false);
      }
    };

    if (open) loadPoints();
  }, [open, stationId]);

  // ==========================
  // 2️⃣ Submit tạo phiên sạc
  // ==========================
  const handleCreateSession = async () => {
    if (!sessionForm.point_id || !sessionForm.vehicle_name || !sessionForm.vehicle_number) {
      toast.error("Vui lòng nhập đủ thông tin bắt buộc");
      return;
    }

    const payload = {
      station_id: stationId,
      point_id: sessionForm.point_id,
      vehicle_name: sessionForm.vehicle_name,
      vehicle_number: sessionForm.vehicle_number,
      start_soc_percent: Number(sessionForm.start_soc_percent),
      staff_operation: staffOperation,
    };

    try {
      toast.loading("Đang tạo phiên sạc...");

      const res = await chargingSessionService.createManualSession(payload);
          await pointService.updatePointStatus(res.data.point_id, {
          point_status: "Charging"
        });
      console.log("Created session:", res);
      toast.dismiss();
      toast.success("Tạo phiên sạc thành công!");

      onOpenChange(false);
      setSessionForm({
        point_id: "",
        vehicle_name: "",
        vehicle_number: "",
        start_soc_percent: 10,
      });

      if (onCreated) onCreated(res?.data);
    } catch (err) {
      toast.dismiss();
      toast.error("Lỗi tạo phiên sạc");
      console.error(err);
    }
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
            ℹ️ Phiên sạc tạo trực tiếp tại trạm — dành cho khách không dùng ứng dụng.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-4">

          {/* POINT ID */}
          <div>
            <Label>Chọn điểm sạc</Label>

            <Select
              value={sessionForm.point_id}
              onValueChange={(value) =>
                setSessionForm({ ...sessionForm, point_id: value })
              }
              disabled={loadingPoints}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingPoints ? "Đang tải..." : "Chọn trụ sạc"} />
              </SelectTrigger>

             <SelectContent>
  {pointList
    .filter((p) => p.point_status === "Empty")
    .map((p) => (
      <SelectItem key={p._id} value={p._id}>
        Trụ #{p.point_number} • Trống
      </SelectItem>
    ))}

  {/* Trụ bận hiển thị nhưng disabled */}
  {pointList
    .filter((p) => p.point_status !== "Empty")
    .map((p) => (
      <SelectItem
        key={p._id}
        value={p._id}
        disabled
        className="opacity-40 pointer-events-none"
      >
        Trụ #{p.point_number} • 
        {p.point_status === "Charging" && " Đang sạc"}
        {p.point_status === "Maintenance" && " Bảo trì"}
        {p.point_status === "Offline" && " Ngoại tuyến"}
      </SelectItem>
    ))}
</SelectContent>

            </Select>
          </div>

          {/* Vehicle name */}
          <div>
            <Label>Tên xe</Label>
            <Input
              placeholder="VD: VinFast VF8"
              value={sessionForm.vehicle_name}
              onChange={(e) =>
                setSessionForm({ ...sessionForm, vehicle_name: e.target.value })
              }
            />
          </div>

          {/* License plate */}
          <div>
            <Label>Biển số xe</Label>
            <Input
              placeholder="VD: 51H-12345"
              value={sessionForm.vehicle_number}
              onChange={(e) =>
                setSessionForm({ ...sessionForm, vehicle_number: e.target.value })
              }
            />
          </div>

          {/* Start SOC */}
          <div>
            <Label>Mức pin ban đầu (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={sessionForm.start_soc_percent}
              onChange={(e) =>
                setSessionForm({
                  ...sessionForm,
                  start_soc_percent: e.target.value,
                })
              }
            />
          </div>

        </div>

        {/* BUTTON */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="bg-emerald-600" onClick={handleCreateSession}>
            Bắt đầu sạc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
