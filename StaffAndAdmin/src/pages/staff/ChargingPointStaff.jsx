
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const ChargingPointStaff = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Dữ liệu các điểm sạc của trạm này
  const chargers = [
    {
      id: 'A01',
      type: 'CCS2',
      status: 'charging',
      statusText: 'Đang sạc',
      power: '120 kW',
      note: null,
      customerName: 'Nguyễn Văn A',
      vehiclePlate: '29A-12345',
      startTime: '14:30',
      phone: '0901234567'
    },
    {
      id: 'A02',
      type: 'CCS2',
      status: 'offline',
      statusText: 'Offline',
      power: null,
      note: 'Không hoạt động'
    },
    {
      id: 'B01',
      type: 'CHAdeMO',
      status: 'available',
      statusText: 'Trống',
      power: null,
      note: 'Sẵn sàng'
    },
    {
      id: 'B02',
      type: 'CHAdeMO',
      status: 'reserved',
      statusText: 'Đặt chỗ',
      power: null,
      note: 'Giữ chỗ đến 15:30',
      customerName: 'Phạm Thị D',
      phone: '0934567890',
      reservedTime: '15:30'
    },
    {
      id: 'C01',
      type: 'AC',
      status: 'charging',
      statusText: 'Đang sạc',
      power: '22 kW',
      note: null,
      customerName: 'Trần Thị B',
      vehiclePlate: '30B-67890',
      startTime: '15:00',
      phone: '0912345678'
    },
    {
      id: 'C02',
      type: 'AC',
      status: 'available',
      statusText: 'Trống',
      power: null,
      note: 'Sẵn sàng'
    },
    {
      id: 'C03',
      type: 'AC',
      status: 'available',
      statusText: 'Trống',
      power: null,
      note: 'Sẵn sàng'
    },
    {
      id: 'C04',
      type: 'AC',
      status: 'available',
      statusText: 'Trống',
      power: null,
      note: 'Sẵn sàng'
    }
  ];

  const getChargerStatusStyle = (status) => {
    switch (status) {
      case 'charging':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-400',
          text: 'text-blue-700',
          badge: 'bg-blue-500'
        };
      case 'available':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-400',
          text: 'text-green-700',
          badge: 'bg-green-500'
        };
      case 'reserved':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-400',
          text: 'text-yellow-700',
          badge: 'bg-yellow-500'
        };
      case 'offline':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-400',
          text: 'text-red-700',
          badge: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          border: 'border-gray-400',
          text: 'text-gray-700',
          badge: 'bg-gray-500'
        };
    }
  };

  const filteredChargers = chargers.filter(charger => {
    const matchesSearch = searchText === '' || 
      charger.id.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'all' || charger.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (charger) => {
    setSelectedCharger(charger);
    setShowDetailDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <Input
                type="text"
                placeholder="Tìm kiếm theo mã điểm sạc..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="charging">Đang sạc</SelectItem>
                  <SelectItem value="available">Trống</SelectItem>
                  <SelectItem value="reserved">Đặt chỗ</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
            <p className="text-sm text-blue-600 mb-1 font-medium">Đang sạc</p>
            <p className="text-3xl font-bold text-blue-700">
              {chargers.filter(c => c.status === 'charging').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 shadow-sm">
            <p className="text-sm text-green-600 mb-1 font-medium">Sẵn sàng</p>
            <p className="text-3xl font-bold text-green-700">
              {chargers.filter(c => c.status === 'available').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 shadow-sm">
            <p className="text-sm text-yellow-600 mb-1 font-medium">Đặt chỗ</p>
            <p className="text-3xl font-bold text-yellow-700">
              {chargers.filter(c => c.status === 'reserved').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 shadow-sm">
            <p className="text-sm text-red-600 mb-1 font-medium">Offline</p>
            <p className="text-3xl font-bold text-red-700">
              {chargers.filter(c => c.status === 'offline').length}
            </p>
          </div>
        </div>

        {/* Chargers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredChargers.map((charger, index) => {
            const style = getChargerStatusStyle(charger.status);
            return (
              <div
                key={`${charger.id}-${index}`}
                className={`${style.bg} ${style.border} ${style.text} rounded-xl p-5 border-2 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer`}
                onClick={() => handleViewDetail(charger)}
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white rounded-full p-3 shadow-sm">
                    <Zap className="h-8 w-8" />
                  </div>
                </div>

                {/* Charger ID */}
                <div className="text-center mb-3">
                  <h4 className="font-bold text-xl mb-1">{charger.id}</h4>
                  <p className="text-xs font-semibold opacity-75">({charger.type})</p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-3">
                  <span className={`${style.badge} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm`}>
                    {charger.statusText}
                  </span>
                </div>

                {/* Power Display */}
                {charger.power && (
                  <div className="text-center mb-3">
                    <p className="font-bold text-xl">{charger.power}</p>
                  </div>
                )}

                {/* Note */}
                {charger.note && (
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium opacity-80">{charger.note}</p>
                  </div>
                )}

                {/* Detail Button */}
                <div className="mt-auto pt-3 border-t border-current/20">
                  <button className="w-full text-sm font-semibold hover:underline transition-all">
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredChargers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Không tìm thấy điểm sạc nào</p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-white text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chi tiết Điểm sạc {selectedCharger?.id}
            </DialogTitle>
            {/* <DialogDescription className="text-gray-600">
              {myStation.name} - {myStation.code}
            </DialogDescription> */}
          </DialogHeader>
          
          {selectedCharger && (
            <div className="space-y-4 mt-2">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600">Loại cổng</span>
                  <span className="font-semibold">{selectedCharger.type}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-sm text-gray-600">Trạng thái</span>
                  <span className={`font-semibold ${getChargerStatusStyle(selectedCharger.status).text}`}>
                    {selectedCharger.statusText}
                  </span>
                </div>
                {selectedCharger.power && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Công suất</span>
                    <span className="font-semibold text-lg">{selectedCharger.power}</span>
                  </div>
                )}
                {selectedCharger.note && (
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-sm text-gray-600">Ghi chú</span>
                    <span className="font-semibold text-sm">{selectedCharger.note}</span>
                  </div>
                )}
              </div>

              {/* Customer Info if charging */}
              {selectedCharger.status === 'charging' && selectedCharger.customerName && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Tên khách hàng</span>
                      <span className="font-semibold text-blue-900">{selectedCharger.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Biển số xe</span>
                      <span className="font-semibold text-blue-900">{selectedCharger.vehiclePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Số điện thoại</span>
                      <span className="font-semibold text-blue-900">{selectedCharger.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Bắt đầu lúc</span>
                      <span className="font-semibold text-blue-900">{selectedCharger.startTime}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reservation Info */}
              {selectedCharger.status === 'reserved' && selectedCharger.customerName && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-900 mb-3">Thông tin đặt chỗ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Tên khách hàng</span>
                      <span className="font-semibold text-yellow-900">{selectedCharger.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Số điện thoại</span>
                      <span className="font-semibold text-yellow-900">{selectedCharger.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-700">Giữ chỗ đến</span>
                      <span className="font-semibold text-yellow-900">{selectedCharger.reservedTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChargingPointStaff;