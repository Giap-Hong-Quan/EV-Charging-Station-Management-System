import { useState } from "react";
import HeaderStaff from "../components/common/HeaderStaff";
import SidebarStaff from "../components/common/SidebarStaff";

import { Outlet } from "react-router-dom";

const LayoutStaff = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar cố định */}
      <SidebarStaff isSidebarOpen={isSidebarOpen} />
      {/* Phần nội dung chính */}
      <div className={'flex flex-col flex-1 transition-all duration-300 '}>
        <HeaderStaff isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutStaff;
