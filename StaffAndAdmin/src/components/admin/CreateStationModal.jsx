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

const CreateStationModal = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    longitude: "",
    latitude: "",
    connector_type: "AC_Type2",
    power_rating: "",
    total_points: "",
    available_points: "",
    price_per_kwh: "",
    status: "online",
  });

  const handleSubmit = () => {
    console.log("Dữ liệu trạm sạc mới:", formData);
    // Tại đây bạn có thể gọi API thêm trạm sạc
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      address: "",
      longitude: "",
      latitude: "",
      connector_type: "AC_Type2",
      power_rating: "",
      total_points: "",
      available_points: "",
      price_per_kwh: "",
      status: "online",
    });
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
            ⚡ Nhập đầy đủ thông tin trạm sạc để thêm vào hệ thống quản lý.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-2">
          {/* Name + Address */}
          <div>
            <Label htmlFor="name">Tên trạm sạc</Label>
            <Input
              id="name"
              placeholder="VD: Trạm EV Siêu Thị Điện Máy Xanh Tô Ký"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="VD: 290 Tô Ký, Phường Tân Chánh Hiệp, Quận 12, TP.HCM"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* Longitude - Latitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
              <Input
                id="longitude"
                type="number"
                placeholder="VD: 106.631180"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
              <Input
                id="latitude"
                type="number"
                placeholder="VD: 10.857250"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>
          </div>

          {/* Connector Type - Power */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="connector_type">Loại cổng sạc</Label>
              <Select
                value={formData.connector_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, connector_type: value })
                }
              >
                <SelectTrigger id="connector_type">
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
              <Label htmlFor="power_rating">Công suất (kW)</Label>
              <Input
                id="power_rating"
                type="number"
                placeholder="VD: 22"
                value={formData.power_rating}
                onChange={(e) =>
                  setFormData({ ...formData, power_rating: e.target.value })
                }
              />
            </div>
          </div>

          {/* Total - Available */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_points">Tổng số điểm sạc</Label>
              <Input
                id="total_points"
                type="number"
                placeholder="VD: 4"
                value={formData.total_points}
                onChange={(e) =>
                  setFormData({ ...formData, total_points: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="available_points">Số điểm trống</Label>
              <Input
                id="available_points"
                type="number"
                placeholder="VD: 2"
                value={formData.available_points}
                onChange={(e) =>
                  setFormData({ ...formData, available_points: e.target.value })
                }
              />
            </div>
          </div>

          {/* Price + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_per_kwh">Giá mỗi kWh (VNĐ)</Label>
              <Input
                id="price_per_kwh"
                type="number"
                placeholder="VD: 4500"
                value={formData.price_per_kwh}
                onChange={(e) =>
                  setFormData({ ...formData, price_per_kwh: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
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

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
          >
            Lưu trạm sạc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStationModal;
