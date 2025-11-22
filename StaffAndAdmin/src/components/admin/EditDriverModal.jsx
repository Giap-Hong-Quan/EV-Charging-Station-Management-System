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
import { userService } from "@/services/userService";
import { toast } from "sonner";

export default function EditDriverModal({ open, onOpenChange, user, onUpdated }) {
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    avatar: null,
    email: "",
  });

  const [preview, setPreview] = useState(null);

  // Load dữ liệu user vào form khi mở modal
  useEffect(() => {
    if (user && open) {
      setForm({
        fullName: user.full_name || "",
        address: user.address || "",
        avatar: null,
        email: user.email || "",
      });

      setPreview(user.avatar || null);
    }
  }, [user, open]);

  // Chọn ảnh avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, avatar: file });
    setPreview(URL.createObjectURL(file));
  };

  // Submit update
  const handleSubmit = async () => {
    const formData = new FormData();

    // ⚠ backend yêu cầu "fullName" (camelCase)
    formData.append("fullName", form.fullName);
    formData.append("address", form.address);
    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    await userService.updateUser(user.id, formData);

    if (onUpdated) onUpdated();
    onOpenChange(false);
    toast.success("Đã cập nhật thông tin tài xế thành công");
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={preview || "/default-avatar.png"}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <Label className="block mb-1">Ảnh đại diện</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          {/* Email - readonly */}
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              disabled
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Full name */}
          <div>
            <Label>Họ và tên</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          {/* Address */}
          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-violet-700 shadow-sm"
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
