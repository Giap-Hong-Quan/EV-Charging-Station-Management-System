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
import { authService } from "@/services/authService";
import { toast } from "sonner";

export default function AddDriverModal({ open, onOpenChange, onCreated }) {
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    address: "",
    role_id: 3, // DRIVER
    avatar: null,
  });

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

  if (onCreated) onCreated();
  onOpenChange(false);
  toast.success("Đã thêm người dùng thành công");
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm tài xế (Driver)</DialogTitle>
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
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
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

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm" onClick={handleSubmit}>
              Thêm tài xế
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
