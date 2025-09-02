import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import Header from "@/components/organisms/Header"
import MobileSidebar from "@/components/organisms/MobileSidebar"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar - Static */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  )
}

export default Layout