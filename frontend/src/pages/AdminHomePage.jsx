import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, fetchAdminOrders, fetchAdminUsers } from "../redux/slices/adminSlice";
import { FaBox, FaShoppingCart, FaUsers, FaRupeeSign } from "react-icons/fa";
import { Link } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className={`bg-white rounded-lg shadow p-6 flex items-center gap-4 hover:shadow-md transition`}>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </Link>
);

function AdminHomePage() {
  const dispatch = useDispatch();
  const { products, orders, users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminOrders());
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => !o.isDelivered).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaRupeeSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="bg-green-500" to="/admin/orders" />
        <StatCard icon={FaShoppingCart} label="Orders" value={orders.length} color="bg-blue-500" to="/admin/orders" />
        <StatCard icon={FaBox} label="Products" value={products.length} color="bg-purple-500" to="/admin/products" />
        <StatCard icon={FaUsers} label="Customers" value={users.length} color="bg-orange-500" to="/admin/users" />
      </div>

      {/* ─── Recent Orders ─── */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-blue-600 text-sm hover:underline">View All →</Link>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.slice(0, 5).map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                <td className="px-4 py-3 font-medium">₹{order.totalPrice}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.isDelivered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {order.isDelivered ? "Delivered" : "Processing"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-6 text-center text-gray-400">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pending Alert ─── */}
      {pendingOrders > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-yellow-700 font-medium">⚠ You have {pendingOrders} pending order{pendingOrders > 1 ? "s" : ""} to fulfill.</p>
        </div>
      )}
    </div>
  );
}

export default AdminHomePage;