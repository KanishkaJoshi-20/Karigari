import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrders } from "../redux/slices/orderSlice";
import { getImageUrl } from "../utils/getImageUrl";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(getMyOrders());
  }, [dispatch, user, navigate]);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg mb-4">You haven't placed any orders yet.</p>
          <Link to="/collections/all" className="text-blue-600 hover:underline font-medium">
            Browse Products →
          </Link>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
          <table className="min-w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Created</th>
                <th className="py-2 px-4">Shipping Address</th>
                <th className="py-2 px-4">Items</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={getImageUrl(order.orderItems[0]?.image) || "https://via.placeholder.com/48"}
                      alt={order.orderItems[0]?.name || "Order"}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                  </td>
                  <td className="py-3 px-4">
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 px-4 font-semibold">₹{order.totalPrice}</td>
                  <td className="py-3 px-4">
                    {order.isDelivered ? (
                      <span className="text-green-600 font-medium">Delivered</span>
                    ) : order.isPaid ? (
                      <span className="text-blue-600 font-medium">Processing</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
