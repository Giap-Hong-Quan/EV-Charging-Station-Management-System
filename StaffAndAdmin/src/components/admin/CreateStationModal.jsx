import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useModalStore } from "@/store/modalStore";
import { stationService } from "@/services/stationService";

const CreateStationModal = ({ open, onOpenChange }) => {
  const close = useModalStore((s) => s.close);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    longitude: "",
    latitude: "",
    connector_type: "AC_Type2",
    power_rating: "",
    total_points: "",
    price_per_kwh: "",
    status: "online",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      longitude: "",
      latitude: "",
      connector_type: "AC_Type2",
      power_rating: "",
      total_points: "",
      price_per_kwh: "",
      status: "online",
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await stationService.createStation(formData);

      // Đóng modal
      close();

      // Reset form để chuẩn bị cho lần mở tiếp theo
      resetForm();

    } catch (err) {
      console.error("❌ Lỗi tạo trạm:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-6 h-6 text-indigo-600" />
            Thêm trạm sạc mới
          </DialogTitle>
        </DialogHeader>

        <Alert className="bg-indigo-50 border-indigo-200">
          <AlertDescription className="text-indigo-800 text-sm">
            ⚡ Nhập đầy đủ thông tin để thêm trạm sạc vào hệ thống.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-3">

          {/* Tên trạm */}
          <div>
            <Label htmlFor="name">Tên trạm sạc</Label>
            <Input
              id="name"
              placeholder="VD: Trạm EV Vincom Quận 9"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="VD: 123 Lê Văn Việt, TP. Thủ Đức"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* Kinh độ & Vĩ độ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kinh độ (Longitude)</Label>
              <Input
                type="number"
                value={formData.longitude}
                placeholder="VD: 106.12345"
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Vĩ độ (Latitude)</Label>
              <Input
                type="number"
                value={formData.latitude}
                placeholder="VD: 10.98765"
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>
          </div>

          {/* Cổng sạc + Công suất */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Loại cổng sạc</Label>
              <Select
                value={formData.connector_type}
                onValueChange={(v) =>
                  setFormData({ ...formData, connector_type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC_Type1">AC Type 1</SelectItem>
                  <SelectItem value="AC_Type2">AC Type 2</SelectItem>
                  <SelectItem value="DC_CHAdeMO">DC CHAdeMO</SelectItem>
                  <SelectItem value="DC_CCS2">DC CCS2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Công suất (kW)</Label>
              <Input
                type="number"
                placeholder="22"
                value={formData.power_rating}
                onChange={(e) =>
                  setFormData({ ...formData, power_rating: e.target.value })
                }
              />
            </div>
          </div>

          {/* Tổng điểm sạc */}
          <div>
            <Label>Tổng số điểm sạc</Label>
            <Input
              type="number"
              placeholder="VD: 4"
              value={formData.total_points}
              onChange={(e) =>
                setFormData({ ...formData, total_points: e.target.value })
              }
            />
          </div>

          {/* Giá + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Giá mỗi kWh (VNĐ)</Label>
              <Input
                type="number"
                placeholder="4500"
                value={formData.price_per_kwh}
                onChange={(e) =>
                  setFormData({ ...formData, price_per_kwh: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Đang hoạt động</SelectItem>
                  <SelectItem value="offline">Ngoại tuyến</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={close}>
            Hủy
          </Button>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Đang lưu..." : "Lưu trạm sạc"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStationModal;
