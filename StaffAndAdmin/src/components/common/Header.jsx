import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge, Bell, Eye, Link2, Maximize2, Menu, MessageSquare, Plus, Settings, X } from 'lucide-react';
import React, { useState } from 'react'
import CreateSessionModal from '../staff/CreateSessionModal';

const Header = ({isSidebarOpen,setIsSidebarOpen}) => {
     const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  return (
     <>
    <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ Trạm hoạt động bình thường
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
                <Eye className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gray-200 text-gray-700 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  32
                </span>
              </Button>

              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Link2 className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <MessageSquare className="w-5 h-5" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Làm mới
              </Button>

              <Button onClick={() => setShowCreateSessionModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4" />
                Tạo phiên sạc
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 mr-4">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Phiên sạc mới</p>
                      <p className="text-xs text-gray-500">Điểm sạc #3 bắt đầu sạc - 5 phút trước</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Hoàn thành sạc</p>
                      <p className="text-xs text-gray-500">Điểm sạc #2 đã hoàn tất - 15 phút trước</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Thanh toán thành công</p>
                      <p className="text-xs text-gray-500">Thu 2.4M VNĐ - 1 giờ trước</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
        </header>
          <CreateSessionModal open={showCreateSessionModal} onOpenChange={setShowCreateSessionModal} />
         </>
  )
}

export default Header