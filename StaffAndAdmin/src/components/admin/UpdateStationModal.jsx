import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { stationService } from "@/services/stationService";

const UpdateStationModal = ({ open, onOpenChange, stationId,onUpdated }) => {
  const [loading, setLoading] = useState(false);

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

  // =========================================
  // 🔥 LOAD DATA THEO ID KHI MỞ MODAL
  // =========================================
  useEffect(() => {
    if (!open || !stationId) return;

    const fetchStation = async () => {
      try {
        setLoading(true);
        const data = await stationService.getStationById(stationId);

        setFormData({
          name: data.name || "",
          address: data.address || "",
          longitude: data.longitude || "",
          latitude: data.latitude || "",
          connector_type: data.connector_type || "AC_Type2",
          power_rating: data.power_rating || "",
          total_points: data.total_points || "",
          available_points: data.available_points ?? 0,
          price_per_kwh: data.price_per_kwh || "",
          status: data.status || "online",
        });
      } catch (err) {
        console.error("Lỗi load station:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [open, stationId]);

  // =========================================
  // 🔥 CẬP NHẬT STATION
  // =========================================
const handleSubmit = async () => {
  try {
    await stationService.updateStation(stationId, formData);

    if (onUpdated) onUpdated(); // gọi callback reload list

    onOpenChange(false); // đóng modal

  } catch (err) {
    console.error("Lỗi update trạm:", err);
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="w-6 h-6 text-blue-600" />
            Cập nhật trạm sạc
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center py-10">Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="space-y-4 mt-2">
              {/* Name */}
              <div>
                <Label>Tên trạm</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Address */}
              <div>
                <Label>Địa chỉ</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              {/* Long / Lat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kinh độ</Label>
                  <Input
                    type="number"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Vĩ độ</Label>
                  <Input
                    type="number"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Connector + Power */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loại cổng</Label>
                  <Select
                    value={formData.connector_type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, connector_type: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại cổng" />
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
                    value={formData.power_rating}
                    onChange={(e) =>
                      setFormData({ ...formData, power_rating: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Points */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tổng điểm sạc</Label>
                  <Input
                    type="number"
                    value={formData.total_points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_points: e.target.value,
                      })
                    }
                  />
                </div>

             <div>
                <Label>Điểm còn trống (không thể chỉnh sửa)</Label>
                <Input
                    type="number"
                    value={formData.available_points}
                    readOnly
                    disabled
                    className="bg-slate-100 cursor-not-allowed text-slate-500"
                />
                </div>
              </div>

              {/* Price + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Giá mỗi kWh (VNĐ)</Label>
                  <Input
                    type="number"
                    value={formData.price_per_kwh}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_kwh: e.target.value,
                      })
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
                      <SelectValue placeholder="Chọn trạng thái" />
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

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
              >
                Cập nhật
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStationModal;
