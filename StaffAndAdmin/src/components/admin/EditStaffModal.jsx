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
import { userService } from "@/services/userService";
import { toast } from "sonner";

export default function EditStaffModal({ open, onOpenChange, staffId, onUpdated }) {
  const [stations, setStations] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    address: "",
    station_id: "",
    avatar: null,
    old_avatar: "", // để hiển thị ảnh cũ
  });

  // Load staff data khi mở modal
  useEffect(() => {
    const loadStaff = async () => {
      if (!staffId) return;

      const res = await userService.getUserById(staffId);
      const data = res.user;
        console.log("Staff data:", data);
      setForm({
        email: data.email || "",
        fullName: data.full_name || "",
        address: data.address || "",
        station_id: data.station_id || "",
        avatar: null,
        old_avatar: data.avatar || "",
      });

      setPreview(data.avatar); // preview ảnh cũ
    };

    if (open) loadStaff();
  }, [open, staffId]);

  // Load danh sách trạm
  useEffect(() => {
    const loadStations = async () => {
      const res = await stationService.getAllStations();
      setStations(res.stations || []);
    };
    if (open) loadStations();
  }, [open]);

  // Preview avatar khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  // Submit update
const handleSubmit = async () => {
  const fd = new FormData();

  fd.append("fullName", form.fullName);
  fd.append("address", form.address);
  fd.append("station_id", form.station_id);

  if (form.avatar) {
    fd.append("avatar", form.avatar);
  }

  await userService.updateUser(staffId, fd);

  if (onUpdated) onUpdated();
  onOpenChange(false);
  toast.success("Đã cập nhật thông tin nhân viên thành công");
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin nhân viên</DialogTitle>
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

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              disabled // email không cho sửa
            />
          </div>

          {/* Full name */}
          <div>
            <Label>Họ và tên</Label>
            <Input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          {/* Station */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm" onClick={handleSubmit}>
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
