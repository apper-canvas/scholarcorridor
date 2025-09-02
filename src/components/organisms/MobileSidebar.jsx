import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Grades", href: "/grades", icon: "GraduationCap" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "FileText" }
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg flex items-center justify-center mr-3">
                <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-display">Scholar Hub</h1>
                <p className="text-xs text-gray-500">Student Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                      )}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Teacher</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileSidebar