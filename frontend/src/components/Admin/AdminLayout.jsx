import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center gap-4 bg-gray-900 text-white p-4">
        <button onClick={toggleSidebar}>
          <FaBars size={22} />
        </button>
        <h1 className="text-lg font-semibold">Karigari Admin</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen absolute md:relative
        transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-20`}
      >
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
