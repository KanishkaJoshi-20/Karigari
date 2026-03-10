import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import { getImageUrl } from "../utils/getImageUrl";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orderDetails: order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, id, user, navigate]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link to="/my-orders" className="text-blue-600 hover:underline">← Back to My Orders</Link>
        </div>
      </div>
    );
  }

  const status = order.isDelivered
    ? "Delivered"
    : order.isPaid
    ? "Processing"
    : "Pending";

  const statusColor = order.isDelivered
    ? "bg-green-100 text-green-700"
    : order.isPaid
    ? "bg-blue-100 text-blue-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: #{order._id}</p>
            <p className="text-gray-500 text-sm">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {status}
          </span>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Payment Info */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Payment Info</h2>
            <p className="text-gray-700">
              <span className="font-medium">Method:</span> {order.paymentMethod}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{" "}
              {order.isPaid ? (
                <span className="text-green-600 font-medium">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-red-600 font-medium">Not Paid</span>
              )}
            </p>
          </div>

          {/* Shipping Info */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Shipping Info</h2>
            <p className="text-gray-700">
              <span className="font-medium">Address:</span>{" "}
              {order.shippingAddress?.address}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode},{" "}
              {order.shippingAddress?.country}
            </p>
            {order.isDelivered && (
              <p className="text-green-600 mt-1 font-medium">
                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-600 text-sm">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={item.product || i} className="border-t">
                    <td className="py-3 px-4 flex items-center gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">₹{item.price}</td>
                    <td className="py-3 px-4">{item.qty}</td>
                    <td className="py-3 px-4 font-medium">
                      ₹{item.price * item.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.itemsPrice || (order.totalPrice - 50)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{order.shippingPrice || 50}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link
            to="/my-orders"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to My Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;
