import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders, markOrderDelivered } from "../redux/slices/adminSlice";
import { toast } from "sonner";
import { FaCheck } from "react-icons/fa";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleDeliver = async (id) => {
    try {
      await dispatch(markOrderDelivered(id)).unwrap();
      toast.success("Order marked as delivered");
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3 text-sm font-mono">{order._id.slice(-8)}</td>
                  <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 font-medium">₹{order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${order.isDelivered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!order.isDelivered && (
                      <button onClick={() => handleDeliver(order._id)} className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        <FaCheck /> Deliver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-400">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
