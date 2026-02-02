import { Link } from "react-router-dom";

const OrderDetailsPage = () => {
  const orderDetails = {
    id: "12345",
    date: "13/12/2024",
    status: "Approved",
    paymentMethod: "PayPal",
    isPaid: true,
    shippingMethod: "Standard",
    address: "New York, USA",
    orderItems: [
      {
        productId: "1",
        name: "Jacket",
        image: "https://via.placeholder.com/100",
        price: 120,
        quantity: 1,
      },
      {
        productId: "2",
        name: "Shirt",
        image: "https://via.placeholder.com/100",
        price: 150,
        quantity: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: #{orderDetails.id}</p>
            <p className="text-gray-500 text-sm">{orderDetails.date}</p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              orderDetails.status === "Approved"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {orderDetails.status}
          </span>
        </div>

        {/* ===== Info Section ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Payment Info */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Payment Info</h2>
            <p className="text-gray-700">
              <span className="font-medium">Method:</span> {orderDetails.paymentMethod}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{" "}
              {orderDetails.isPaid ? (
                <span className="text-green-600 font-medium">Paid</span>
              ) : (
                <span className="text-red-600 font-medium">Not Paid</span>
              )}
            </p>
          </div>

          {/* Shipping Info */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Shipping Info</h2>
            <p className="text-gray-700">
              <span className="font-medium">Method:</span> {orderDetails.shippingMethod}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Address:</span> {orderDetails.address}
            </p>
          </div>
        </div>

        {/* ===== Products Table ===== */}
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
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-t">
                    <td className="py-3 px-4 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">${item.price}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 font-medium">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== Back Link ===== */}
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
