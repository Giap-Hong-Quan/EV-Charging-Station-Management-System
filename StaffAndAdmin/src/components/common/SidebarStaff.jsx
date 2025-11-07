import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { mainMenu } from "@/lib/Contands"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { AlertCircle, ChevronUp, LogOut, MapPin, Plus, Settings, User, Zap, DollarSign } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import CreateSessionModal from "../staff/CreateSessionModal"
import CashPaymentModal from "../staff/CashPaymentModal"
import ReportIssueModal from "../staff/ReportIssueModal"
import { authService } from "@/services/authService"
import { useState, useEffect } from "react"
import { Badge, BarChart3, BatteryCharging, Calendar,  Home,  } from "lucide-react"

const SidebarStaff = ({isSidebarOpen}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Modal states
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);
  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false)
  const [userData, setUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
    })
  // Thêm useEffect để theo dõi thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updatedUserData = JSON.parse(localStorage.getItem('user') || '{}')
        setUserData(updatedUserData)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }

    // Lắng nghe sự kiện storage
    window.addEventListener('storage', handleStorageChange)
    
    // Kiểm tra định kỳ (fallback)
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])


  // Hàm xử lý logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      
      // Gọi API logout từ authService
      await authService.logout()
      
      // Chuyển hướng về trang login
      navigate('/login')
      
    } catch (error) {
      console.error('Logout error:', error)
      // Trong trường hợp có lỗi, vẫn xóa local storage và chuyển hướng
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate('/login')
    } finally {
      setLoggingOut(false)
    }
  }
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
        </Button>
      );
    });
  };
  return (
    <>
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-emerald-600 to-emerald-700  text-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-emerald-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-emerald-600 " />
            </div>
            <div>
              <h1 className="text-xl font-bold">EV Charging</h1>
              <p className="text-xs text-emerald-200">Admin Dashboard</p>
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

          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => setShowCreateSessionModal(true)}
              className="w-full justify-start gap-3 px-6 py-3 h-auto rounded-none text-white hover:bg-emerald-600"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo phiên sạc</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowCashPaymentModal(true)}
              className="w-full justify-start gap-3 px-6 py-3 h-auto rounded-none text-white hover:bg-emerald-600"
            >
              <DollarSign className="w-5 h-5" />
              <span>Thu tiền mặt</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowReportIssueModal(true)}
              className="w-full justify-start gap-3 px-6 py-3 h-auto rounded-none text-white hover:bg-emerald-600"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Báo cáo sự cố</span>
            </Button>
          </div>
        </nav>

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-emerald-600/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto bg-emerald-800 hover:bg-emerald-700 rounded-lg text-white">
                <Avatar className="w-10 h-10">
  <AvatarImage 
    src={userData.avatar || userData.avatarUrl || "https://github.com/shadcn.png"} 
    alt={userData.fullName}
  />
  <AvatarFallback className="bg-emerald-600">
    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'NA'}
  </AvatarFallback>
</Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{userData.fullName}</p>
                  <p className="text-xs text-emerald-200">Nhân viên trạm sạc</p>
                </div>
                <ChevronUp className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-4">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={()=> navigate('/profile')}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Modals */}
      <CreateSessionModal open={showCreateSessionModal} onOpenChange={setShowCreateSessionModal} />
      <CashPaymentModal open={showCashPaymentModal} onOpenChange={setShowCashPaymentModal} />
      <ReportIssueModal open={showReportIssueModal} onOpenChange={setShowReportIssueModal} />
    </>
  )
}

export default SidebarStaff