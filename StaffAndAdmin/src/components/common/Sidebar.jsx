import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { AlertCircle, Badge, BarChart3, BatteryCharging, Calendar, ChevronUp, Home, LogOut, MapPin, Plus, Settings, User, Zap } from "lucide-react"

const Sidebar = ({isSidebarOpen}) => {
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
          
          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto bg-emerald-800 hover:bg-emerald-800 border-l-4 border-white rounded-none text-white">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Tổng quan</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white relative">
            <BatteryCharging className="w-5 h-5" />
            <span>Phiên sạc</span>
            <Badge className="absolute right-4 bg-red-500 hover:bg-red-500 text-white px-2">9</Badge>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white">
            <Zap className="w-5 h-5" />
            <span>Điểm sạc</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white">
            <Calendar className="w-5 h-5" />
            <span>Lịch sử</span>
          </Button>

          <Separator className="my-4 bg-emerald-600/50" />

          {/* Section: Thao tác nhanh */}
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider px-3">Thao tác nhanh</p>
          </div>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white">
            <Plus className="w-5 h-5" />
            <span>Tạo phiên sạc</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white">
            <Home className="w-5 h-5" />
            <span>Thu tiền mặt</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-3 px-6 py-3 h-auto hover:bg-emerald-600 rounded-none text-white">
            <AlertCircle className="w-5 h-5" />
            <span>Báo cáo sự cố</span>
          </Button>
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