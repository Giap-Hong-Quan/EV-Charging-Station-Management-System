import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ChargingSessionManager = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);

  // 🔋 Dữ liệu mẫu có thêm tên xe & biển số
  const sessions = [
    {
      id: 'S00123',
      code: 'HN-81-C04',
      vehicleName: 'VinFast VF8',
      licensePlate: '30H-123.45',
      startTime: '2025-11-02 14:00',
      status: 'Đang sạc',
      statusColor: 'text-blue-600',
      totalCost: '85.000 VNĐ',
      paymentMethod: 'Online',
      action: 'Dừng'
    },
    {
      id: 'S00124',
      code: 'HN-82-A01',
      vehicleName: 'Tesla Model 3',
      licensePlate: '51G-999.88',
      startTime: '2025-11-02 14:00',
      status: 'Chờ TT',
      statusColor: 'text-yellow-600',
      totalCost: '142.000 VNĐ',
      paymentMethod: 'Tiền mặt',
      action: 'In HĐ'
    },
    {
      id: 'S00125',
      code: 'HN-81-C01',
      vehicleName: 'VinFast VF5',
      licensePlate: '43B-022.33',
      startTime: '2025-11-02 14:00',
      status: 'Đã dùng',
      statusColor: 'text-green-600',
      totalCost: '35.000 VNĐ',
      paymentMethod: 'Online',
      action: 'In HĐ'
    },
    {
      id: 'S00126',
      code: 'HN-83-B02',
      vehicleName: 'Hyundai Kona EV',
      licensePlate: '60A-234.56',
      startTime: '2025-11-03 09:30',
      status: 'Đang sạc',
      statusColor: 'text-blue-600',
      totalCost: '120.000 VNĐ',
      paymentMethod: 'Online',
      action: 'Dừng'
    },
    {
      id: 'S00127',
      code: 'HN-84-D03',
      vehicleName: 'VinFast VF9',
      licensePlate: '72C-678.99',
      startTime: '2025-11-03 11:15',
      status: 'Đã dùng',
      statusColor: 'text-green-600',
      totalCost: '95.000 VNĐ',
      paymentMethod: 'Tiền mặt',
      action: 'In HĐ'
    },
    {
      id: 'S00127',
      code: 'HN-84-D03',
      vehicleName: 'VinFast VF9',
      licensePlate: '72C-678.99',
      startTime: '2025-11-03 11:15',
      status: 'Đã dùng',
      statusColor: 'text-green-600',
      totalCost: '95.000 VNĐ',
      paymentMethod: 'Tiền mặt',
      action: 'In HĐ'
    },
    {
      id: 'S00127',
      code: 'HN-84-D03',
      vehicleName: 'VinFast VF9',
      licensePlate: '72C-678.99',
      startTime: '2025-11-03 11:15',
      status: 'Đã dùng',
      statusColor: 'text-green-600',
      totalCost: '95.000 VNĐ',
      paymentMethod: 'Tiền mặt',
      action: 'In HĐ'
    },
    {
      id: 'S00127',
      code: 'HN-84-D03',
      vehicleName: 'VinFast VF9',
      licensePlate: '72C-678.99',
      startTime: '2025-11-03 11:15',
      status: 'Đã dùng',
      statusColor: 'text-green-600',
      totalCost: '95.000 VNĐ',
      paymentMethod: 'Tiền mặt',
      action: 'In HĐ'
    }
  ];

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('vi-VN');
  };

  // 🔎 Lọc dữ liệu
  const filteredSessions = sessions.filter((session) => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      text === '' ||
      session.id.toLowerCase().includes(text) ||
      session.code.toLowerCase().includes(text) ||
      session.vehicleName.toLowerCase().includes(text) ||
      session.licensePlate.toLowerCase().includes(text);

    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;

    let matchesDate = true;
    if (selectedDate) {
      const sessionDate = new Date(session.startTime);
      matchesDate = sessionDate.toDateString() === new Date(selectedDate).toDateString();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Bộ lọc */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Ô tìm kiếm */}
            <div className="flex-1 min-w-[250px]">
              <Input
                type="text"
                placeholder="Tìm theo ID / Điểm sạc / Xe / Biển số..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Bộ lọc trạng thái */}
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái: Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Đang sạc">Đang sạc</SelectItem>
                  <SelectItem value="Chờ TT">Chờ TT</SelectItem>
                  <SelectItem value="Đã dùng">Đã dùng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bộ lọc ngày */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDate(selectedDate) : 'Chọn ngày'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Xóa bộ lọc */}
          {(searchText || statusFilter !== 'all' || selectedDate) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Đang lọc:</span>
              {selectedDate && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Ngày: {formatDate(selectedDate)}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchText('');
                  setStatusFilter('all');
                  setSelectedDate(null);
                }}
                className="text-xs text-teal-600"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID<br />Phiên sạc
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm<br />sạc
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên xe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Biển số
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian<br />bắt đầu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng<br />thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng<br />chi phí
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{session.id}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-medium">{session.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.vehicleName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.licensePlate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.startTime}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${session.statusColor}`}>{session.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{session.totalCost}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{session.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm text-emerald-600 font-medium cursor-pointer hover:underline">
                        {session.action}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-500">
                      Không tìm thấy phiên sạc nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">Hiển thị {filteredSessions.length} kết quả</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>‹</Button>
              <Button variant="outline" size="sm" disabled>›</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingSessionManager;
