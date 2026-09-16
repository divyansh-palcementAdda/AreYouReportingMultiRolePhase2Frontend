import { useState } from 'react';
import SideBar from '../pages/sideBar';
import NavBar from '../pages/navBar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <NavBar />
      <main className="lg:ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
