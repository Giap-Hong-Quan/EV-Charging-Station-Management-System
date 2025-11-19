import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { menuAdmin } from "@/lib/Contands";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  LogOut,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarAdmin = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

 

  const renderMenu = (section) => (
    <div key={section.title} className="mb-3">
      <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider px-6 mb-1">
        {section.title}
      </p>
      {section.items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.path;
        return (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={`w-full justify-start gap-3 px-6 py-3 h-auto rounded-none text-white relative
              ${active ? "bg-indigo-800 border-l-4 border-white" : "hover:bg-indigo-700"}`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="absolute right-6 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-0"} 
        bg-gradient-to-b from-indigo-500 via-purple-600 to-indigo-800
        text-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-indigo-400/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold">EV Charging</h1>
              <p className="text-xs text-indigo-200">Admin Control Center</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">{menuAdmin.map(renderMenu)}</nav>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-500/40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 p-3 h-auto bg-indigo-800 hover:bg-indigo-700 rounded-lg text-white"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-indigo-600">AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold truncate">Admin</p>
                  <p className="text-xs text-indigo-200">Quản trị viên</p>
                </div>
                <ChevronUp className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 ml-4">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};

export default SidebarAdmin;
