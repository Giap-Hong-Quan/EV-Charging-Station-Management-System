import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge, Bell, Menu, Maximize2, Plus, Settings, X } from "lucide-react";
import { useState } from "react";
import CreateStationModal from "../admin/CreateStationModal";

const HeaderAdmin = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [showCreateStationModal, setShowCreateStationModal] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-indigo-100 shadow-md">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-indigo-100"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Tổng quan</h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                ✓ Hệ thống ổn định
              </Badge>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreateStationModal(true)}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4" /> Thêm trạm
            </Button>

            <Button variant="outline" className="gap-2">
              Export
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="icon" className="relative hover:bg-indigo-100">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-indigo-100">
              <Settings className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-indigo-100">
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <CreateStationModal open={showCreateStationModal} onOpenChange={setShowCreateStationModal} />
    </>
  );
};

export default HeaderAdmin;
