import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Mail, Sparkles } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId") || "12345";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-rose-200 to-orange-200 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-md opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 rounded-full p-5 shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                Order Confirmed!
              </h2>
              <Sparkles className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-gray-600 text-base">
              Thank you! Your order is on its way
            </p>
          </div>

          {/* Order ID Card */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 mb-5 border-2 border-orange-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Order ID</span>
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <p className="font-bold text-3xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
              #{orderId}
            </p>
          </div>

          {/* Email Confirmation */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">Confirmation Sent</p>
                <p className="text-blue-700 leading-relaxed">
                  Check your email for order details and tracking information
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="group w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white py-3.5 rounded-xl font-bold text-base hover:from-orange-600 hover:via-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View Order Details
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{" "}
            <button className="text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;