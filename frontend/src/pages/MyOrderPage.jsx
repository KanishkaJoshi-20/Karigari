import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrders } from "../redux/slices/orderSlice";
import { getImageUrl } from "../utils/getImageUrl";
import { Package, ChevronRight } from "lucide-react";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, myOrdersLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user?._id) {
      dispatch(getMyOrders());
    }
  }, [dispatch, user?._id, navigate]);

  if (myOrdersLoading) {
    return (
      <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-8 text-center text-red-500 flex items-center justify-center min-h-[400px]">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-slate-100 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Package size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-4xl mb-4 block text-slate-300">📦</span>
          <p className="text-lg text-slate-600 font-medium mb-4">You haven't placed any orders yet.</p>
          <Link to="/collections/all" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              to={`/order/${order._id}`}
              key={order._id}
              className="block bg-white border border-slate-100 rounded-2xl p-4 hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={getImageUrl(order.orderItems[0]?.image) || "https://via.placeholder.com/64"}
                      alt={order.orderItems[0]?.name || "Order"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      Order #{order._id.slice(-8)}
                      {order.isDelivered ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Delivered</span>
                      ) : order.isPaid ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Processing</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Pending</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })} • {order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400 mb-0.5">Total Amount</p>
                    <p className="font-bold text-slate-900">₹{order.totalPrice}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
