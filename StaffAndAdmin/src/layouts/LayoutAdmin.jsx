import HeaderAdmin from '@/components/common/HeaderAdmin'
import SidebarAdmin from '@/components/common/SidebarAdmin'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';

const LayoutAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar cố định */}
      <SidebarAdmin isSidebarOpen={isSidebarOpen} />
      {/* Phần nội dung chính */}
      <div className={'flex flex-col flex-1 transition-all duration-300 '}>
        <HeaderAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutAdmin