import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import SearchBar from "@/components/molecules/SearchBar"
import { useState } from "react"

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-4"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div className="hidden sm:block">
            <h2 className="text-xl font-bold text-gray-900 font-display">Good morning!</h2>
            <p className="text-sm text-gray-600">Ready to manage your students today?</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, classes..."
              className="w-64"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <ApperIcon name="Bell" className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </Button>

          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header