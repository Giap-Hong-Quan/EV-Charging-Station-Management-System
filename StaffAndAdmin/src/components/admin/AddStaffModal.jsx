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
import { stationService } from "@/services/stationService";
import { authService } from "@/services/authService";
import { toast } from "sonner";

export default function AddStaffModal({ open, onOpenChange, onCreated }) {
  const [stations, setStations] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    address: "",
    station_id: "",
    role_id: 2, // STAFF
    avatar: null,
  });

  // 🔥 Load danh sách trạm
  useEffect(() => {
    const loadStations = async () => {
      const res = await stationService.getAllStations();
      setStations(res.stations || []);
    };
    if (open) loadStations();
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

 const handleSubmit = async () => {
  const fd = new FormData();
  Object.keys(form).forEach((key) => {
    fd.append(key, form[key]);
  });

  await authService.register(fd);
  setForm({
    email: "",
    password: "",
    fullName: "",
    address: "",
    station_id: "",
    role_id: 2,
    avatar: null,
  });
  setPreview(null); // reset avatar preview

  if (onCreated) onCreated();
  onOpenChange(false);
  toast.success("Đã thêm nhân viên thành công");
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <Label>Ảnh đại diện</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Họ và tên</Label>
            <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
          </div>

          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          {/* Chọn trạm sạc */}
          <div>
            <Label>Thuộc trạm sạc</Label>
            <select
              className="border w-full rounded p-2"
              value={form.station_id}
              onChange={(e) =>
                setForm({ ...form, station_id: e.target.value })
              }
            >
              <option value="">-- Chọn trạm --</option>
              {stations.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm" onClick={handleSubmit}>
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
