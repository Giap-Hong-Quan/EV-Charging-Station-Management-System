// src/layout/Layout.jsx
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar cố định */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Phần nội dung chính */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
