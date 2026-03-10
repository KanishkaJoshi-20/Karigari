import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isAdmin = user && user.isAdmin;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (!result.user?.isAdmin) {
        toast.error("You are not authorized as admin");
      }
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  // If not admin, show login form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <form onSubmit={handleAdminLogin} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center">Karigari Admin</h1>
          <p className="text-gray-500 text-center mb-6">Login to manage your business</p>

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded mb-4"
            placeholder="admin@karigari.com"
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded mb-6"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    );
  }

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
