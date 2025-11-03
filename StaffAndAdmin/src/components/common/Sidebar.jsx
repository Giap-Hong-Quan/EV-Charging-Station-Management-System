import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mainMenu, quickActions } from "@/lib/Contands"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { AlertCircle, Badge, BarChart3, BatteryCharging, Calendar, ChevronUp, Home, LogOut, MapPin, Plus, Settings, User, Zap } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

const Sidebar = ({isSidebarOpen}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const renderMenu = (items) => {
  return items.map((item) => {
    const Icon = item.icon;
    const active = pathname === item.path;

    return (
      <Button
        key={item.label}
        variant="ghost"
        onClick={() => navigate(item.path)}
        className={`w-full justify-start gap-3 px-6 py-3 h-auto rounded-none text-white relative ${
          active ? "bg-emerald-800 border-l-4 border-white" : "hover:bg-emerald-600"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
        {item.badge && (
          <Badge className="absolute right-4 bg-red-500 text-white px-2">
            {item.badge}
          </Badge>
        )}
      </Button>
    );
  });
};

  return (
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-emerald-600 to-emerald-700  text-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-emerald-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-emerald-600 " />
            </div>
            <div>
              <h1 className="text-xl font-bold">EV Charging</h1>
              <p className="text-xs text-emerald-200">Staff Dashboard</p>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="px-6 py-4 bg-emerald-700/50 border-b border-emerald-600/50">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-1 flex-shrink-0 " />
            <div>
              <p className="text-sm font-semibold">VinFast Landmark 81</p>
              <p className="text-xs text-emerald-200">720A Điện Biên Phủ, Quận 1</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Section: Chính */}
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider px-3">Chính</p>
          </div>
          
          {renderMenu(mainMenu)}

          <Separator className="my-4 bg-emerald-600/50" />

          {/* Section: Thao tác nhanh */}
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider px-3">Thao tác nhanh</p>
          </div>

          {renderMenu(quickActions)}
        </nav>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-emerald-600/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto bg-emerald-800 hover:bg-emerald-700 rounded-lg text-white">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-emerald-600">NA</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">Nguyễn Văn A</p>
                  <p className="text-xs text-emerald-200">Nhân viên trạm sạc</p>
                </div>
                <ChevronUp className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-4">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
  )
}

export default Sidebar