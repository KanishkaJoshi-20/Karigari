import { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          _id: "12345",
          createdAt: new Date(),
          shippingAddress: { city: "New York", country: "USA" },
          orderItems: [
            {
              name: "Handmade Crochet Teddy",
              image: "https://picsum.photos/200/200?random=1",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: "67890",
          createdAt: new Date(),
          shippingAddress: { city: "Delhi", country: "India" },
          orderItems: [
            {
              name: "Crochet Flower Pot",
              image: "https://picsum.photos/200/200?random=2",
            },
          ],
          totalPrice: 450,
          isPaid: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

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
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50"
              >
                {/* Image */}
                <td className="py-3 px-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>

                {/* Order ID */}
                <td className="py-3 px-4 font-medium text-gray-900">
                  {order._id}
                </td>

                {/* Created */}
                <td className="py-3 px-4">
                  {order.createdAt.toLocaleDateString()}
                </td>

                {/* Shipping Address */}
                <td className="py-3 px-4">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.country}
                </td>

                {/* Items */}
                <td className="py-3 px-4">
                  {order.orderItems[0].name}
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-semibold">
                  ₹{order.totalPrice}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  {order.isPaid ? (
                    <span className="text-green-600 font-medium">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      Not Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
