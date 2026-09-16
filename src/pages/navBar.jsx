import { Bell, User } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16  bg-gray-50 shadow-sm border-b border-gray-200 flex items-center justify-end px-6 z-30 lg:ml-64">
      <div className="flex items-center gap-4">
        {/* Bell Icon */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={24} className="text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
          <span className="font-medium text-gray-700 hidden sm:block">User</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
