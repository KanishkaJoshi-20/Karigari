import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTimes
} from "react-icons/fa";

const AdminSidebar = ({ onClose }) => {
  return (
    <div className="p-5 relative">

      {/* Close button (mobile only) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden"
      >
        <FaTimes size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-8">Karigari</h2>

      <nav className="flex flex-col gap-4">
        <NavLink to="/admin" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <NavLink to="/admin/products" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <FaBox /> Products
        </NavLink>

        <NavLink to="/admin/orders" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <FaShoppingCart /> Orders
        </NavLink>

        <NavLink to="/admin/users" className="flex items-center gap-3 p-2 rounded hover:bg-gray-700">
          <FaUsers /> Users
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
