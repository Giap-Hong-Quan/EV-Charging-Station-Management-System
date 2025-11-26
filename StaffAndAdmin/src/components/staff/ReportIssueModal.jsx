import React, { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

import { maintenanceService } from '@/services/maintenanceService';
import { pointService } from '@/services/pointService';

const ReportIssueModal = ({ open, onOpenChange }) => {
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    point_id: "",
    issue_type: "",
    description: "",
    image: null,
  });

  // Load điểm sạc theo station_id
  useEffect(() => {
    if (!user?.station_id) return;

    const fetchPoints = async () => {
      try {
        const res = await pointService.getPointsByStationId(user.station_id);
        setPoints(res.points || []);
      } catch (err) {
        console.error("Lỗi load points:", err);
      }
    };
    fetchPoints();
  }, []);

  // Submit API
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("station_id", user.station_id);
      fd.append("point_id", form.point_id);
      fd.append("issue_type", form.issue_type);
      fd.append("description", form.description);

      if (form.image) fd.append("image", form.image);

      await maintenanceService.createMaintenance(fd);

      toast.success("Đã báo cáo sự cố thành công!");

      onOpenChange(false);

      // reset form
      setForm({
        point_id: "",
        issue_type: "",
        description: "",
        image: null,
      });

    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wrench className="w-6 h-6 text-red-600" />
            Báo cáo sự cố
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* POINT */}
          <div>
            <Label>Điểm sạc</Label>
            <Select
              value={form.point_id}
              onValueChange={(v) => setForm({ ...form, point_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn điểm sạc --" />
              </SelectTrigger>
              <SelectContent>
                {points.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name || `Điểm sạc #${p.point_number}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issue type */}
          <div>
            <Label>Loại sự cố</Label>
            <Select
              value={form.issue_type}
              onValueChange={(v) => setForm({ ...form, issue_type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- Chọn loại sự cố --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mất kết nối">Mất kết nối</SelectItem>
                <SelectItem value="Cáp hỏng">Cáp hỏng</SelectItem>
                <SelectItem value="Hỏng đầu sạc">Hỏng đầu sạc</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết sự cố..."
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* IMAGE */}
          <div>
            <Label>Ảnh minh chứng (tùy chọn)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, image: e.target.files[0] })
              }
            />
          </div>

          <Alert className="bg-yellow-50 border-yellow-300">
            <AlertDescription className="text-yellow-800 text-sm">
              ⚠️ Sự cố sẽ được gửi ngay cho Admin & Kỹ thuật viên.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            disabled={!form.point_id || !form.issue_type || !form.description || loading}
            onClick={handleSubmit}
          >
            {loading ? "Đang gửi..." : "Gửi báo cáo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
