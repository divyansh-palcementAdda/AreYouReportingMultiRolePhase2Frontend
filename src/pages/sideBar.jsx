import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X, LayoutDashboard, ClipboardList, CheckCircle, Users, Building, Clock, Briefcase, BarChart3, Settings, Book } from 'lucide-react';

const SideBar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/admin-dashboard' },
    { name: 'All Task', icon: ClipboardList, route: '/all-task' },
    { name: 'My Task', icon: CheckCircle , route: '/my-task'},
    { name: 'All User', icon: Users ,route: '/all-users'},
    { name: 'All Department', icon: Building,route: '/all-departments' },
    // { name: 'All Subjects', icon: Book, route: '/all-subjects' },
    { name:  'All Task Template' , icon: CheckCircle, route: '/all-task-template' },
    { name: 'Pending Approval', icon: Clock ,route: '/pending-approve' },
    { name: 'All Work', icon: Briefcase, route: '/all-works' },
    { name: 'User Task Analytics', icon: BarChart3,route:"/user-task-analitices" },
    {
      name: 'Settings',
      icon: Settings,
      submenu: [
        // { name: 'Profile Settings' },
        // { name: 'User Management' },
        { name: 'Role & Permission',route: '/role-and-permission'},
        // { name: 'Notification Settings' },
        // { name: 'System Settings' },
      ],
    },
  ];

  const currentPath = location.pathname;

  const isParentActive = (item) => {
    if (item.route) return currentPath === item.route;
    if (item.submenu) return item.submenu.some((sub) => sub.route && currentPath === sub.route);
    return false;
  };

  const isSubmenuActive = (route) => currentPath === route;

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleSubmenuClick = (route) => {
    if (route) navigate(route);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gray-50 shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        {/* Logo */}
        <div className="  mt-1 p-2">
          <img
            src="/src/assets/pngImages/RU Logo.png"
            alt="Logo"
            className="h-12 w-auto mx-auto"
          />
          <p className="text-green-800 text-center text-gray-700 font-medium mt-2 font-serif">Are You Reporting</p>
        </div>

        {/* Menu Items */}
        <nav
          className="p-4 overflow-y-auto h-[calc(100vh-80px)]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isParentActive(item) || openSubmenu === index
                          ? 'bg-green-50 text-green-800 border-l-4 border-green-800'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} className={isParentActive(item) || openSubmenu === index ? 'text-green-800' : 'text-gray-600'} />
                        <span className="font-medium text-sm font-mono">{item.name}</span>
                      </div>
                      {openSubmenu === index ? (
                        <ChevronDown size={20} className={isParentActive(item) || openSubmenu === index ? 'text-green-800' : 'text-gray-500'} />
                      ) : (
                        <ChevronRight size={20} className={isParentActive(item) || openSubmenu === index ? 'text-green-800' : 'text-gray-500'} />
                      )}
                    </button>
                    {openSubmenu === index && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <button
                              onClick={() => handleSubmenuClick(subItem.route)}
                              className={`block w-full text-left p-2 rounded-lg transition-colors ${
                                isSubmenuActive(subItem.route)
                                  ? 'bg-gradient-to-b from-white/0 to-green-800/10 text-[#2b7818] font-medium'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {subItem.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpenSubmenu(null);
                      if (item.route) navigate(item.route);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full ${
                      isParentActive(item)
                        ? 'bg-green-50 text-green-800 border-l-4 border-green-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon size={20} className={isParentActive(item) ? 'text-green-800' : 'text-gray-600'} />
                    <span className="font-medium text-sm font-mono">{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 backdrop-blur-xs bg-black/30 z-30"
        />
      )}
    </>
  );
};

export default SideBar;
