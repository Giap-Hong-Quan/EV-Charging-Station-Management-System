import { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

const LayoutStaff = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar cố định */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      {/* Phần nội dung chính */}
      <div className={'flex flex-col flex-1 transition-all duration-300 '}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LayoutStaff;
