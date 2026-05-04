import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { updateUserProfile, getUserProfile } from "../../redux/slices/authSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import axiosInstance from "../../api/axiosConfig";

const SHIPPING_COST = 50;
const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

/* ─── Sub-components defined OUTSIDE Checkout to prevent focus loss ─── */

const AddressForm = ({ shippingAddress, onChange, onSubmit, hasSavedAddress, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <h3 className="text-lg font-medium">Contact Details</h3>

    <div>
      <label className="block text-gray-700">Email</label>
      <input
        type="email"
        name="email"
        value={shippingAddress.email}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          value={shippingAddress.firstName}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={shippingAddress.lastName}
          onChange={onChange}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700">Phone</label>
      <input
        type="tel"
        name="phone"
        value={shippingAddress.phone}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>

    <h3 className="text-lg font-medium mt-6">Shipping Address</h3>

    <div>
      <label className="block text-gray-700">Address</label>
      <input
        type="text"
        name="address"
        value={shippingAddress.address}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={shippingAddress.city}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Postal Code</label>
        <input
          type="text"
          name="postalCode"
          value={shippingAddress.postalCode}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-gray-700">Country</label>
      <input
        type="text"
        name="country"
        value={shippingAddress.country}
        onChange={onChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>

    <div className="flex gap-4 mt-6">
      <button
        type="submit"
        className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
      >
        CONTINUE TO PAYMENT
      </button>
      {hasSavedAddress && (
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
);

const SavedAddressView = ({ shippingAddress, onEdit, onContinue }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Delivery Address</h3>
      <button
        type="button"
        onClick={onEdit}
        className="text-sm border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
      >
        Update / Add New
      </button>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg border space-y-1 mb-6">
      <p className="font-medium">
        {shippingAddress.firstName} {shippingAddress.lastName}
      </p>
      <p className="text-gray-600">{shippingAddress.address}</p>
      <p className="text-gray-600">
        {shippingAddress.city}, {shippingAddress.postalCode}
      </p>
      <p className="text-gray-600">{shippingAddress.country}</p>
      <p className="text-gray-500 text-sm">{shippingAddress.phone}</p>
      {shippingAddress.email ? (
        <p className="text-gray-500 text-sm">{shippingAddress.email}</p>
      ) : null}
    </div>

    <button
      type="button"
      onClick={onContinue}
      className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
    >
      CONTINUE TO PAYMENT
    </button>
  </div>
);

const PaymentMethodView = ({ paymentMethod, onMethodChange, onBack, onContinue }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
    <div className="space-y-4">
      <label
        className={`block border p-4 rounded cursor-pointer ${
          paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => onMethodChange("COD")}
            className="w-5 h-5 accent-black"
          />
          <span className="font-medium">Cash on Delivery (COD)</span>
        </div>
        <p className="text-gray-500 text-sm mt-2 ml-8">
          Pay with cash when your order is delivered.
        </p>
      </label>

      <label className="block border p-4 rounded cursor-not-allowed border-gray-200 opacity-60">
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="Card"
            disabled
            className="w-5 h-5"
          />
          <span className="font-medium flex items-center gap-2">
            Credit / Debit Card{" "}
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-bold">
              Coming Soon
            </span>
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-2 ml-8">
          Online payments will be available shortly.
        </p>
      </label>
    </div>

    <div className="flex gap-4 mt-6">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
      >
        Back to Address
      </button>
      <button
        type="button"
        onClick={onContinue}
        className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
      >
        CONTINUE TO REVIEW
      </button>
    </div>
  </div>
);

const ReviewOrderView = ({ shippingAddress, paymentMethod, creatingOrder, loading, cartItems, onBack, onPlaceOrder, onEditStep }) => (
  <div>
    <h3 className="text-lg font-medium mb-4">Review Your Order</h3>

    <div className="bg-gray-50 p-4 rounded-lg border mb-6">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-700">Shipping to</h4>
        <button onClick={() => onEditStep(1)} className="text-sm text-blue-600 hover:underline">
          Edit
        </button>
      </div>
      <p className="text-gray-600 text-sm">
        {shippingAddress.firstName} {shippingAddress.lastName} <br />
        {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}
      </p>
    </div>

    <div className="bg-gray-50 p-4 rounded-lg border mb-6">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-700">Payment Method</h4>
        <button onClick={() => onEditStep(2)} className="text-sm text-blue-600 hover:underline">
          Edit
        </button>
      </div>
      <p className="text-gray-600 text-sm font-medium">
        {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
      </p>
    </div>

    <div className="flex gap-4 mt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={creatingOrder}
        className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition disabled:opacity-50"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={creatingOrder || loading || cartItems.length === 0}
        className="w-2/3 bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
      >
        {creatingOrder || loading ? "PROCESSING..." : "PLACE ORDER"}
      </button>
    </div>
  </div>
);

/* ─── Main Checkout Component ─── */

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { loading: creatingOrder } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [user, navigate]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    const nameParts = (user.name || "").trim().split(/\s+/).filter(Boolean);
    setShippingAddress({
      email: user.email || "",
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      address: user.address || "",
      city: user.city || "",
      postalCode: user.postalCode || "",
      country: user.country || "",
      phone: user.phone || "",
    });
  }, [user]);

  const subtotal = useMemo(
    () =>
      round2(
        cartItems.reduce(
          (acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1),
          0
        )
      ),
    [cartItems]
  );
  const total = round2(subtotal + SHIPPING_COST);

  const hasSavedAddress = Boolean(
    shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      shippingAddress.country &&
      shippingAddress.phone
  );

  useEffect(() => {
    if (!user) return;
    setIsEditingAddress(!hasSavedAddress);
  }, [user, hasSavedAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (isEditingAddress || !hasSavedAddress) {
      const requiredFields = ["address", "city", "postalCode", "country", "phone"];
      const missingField = requiredFields.find(
        (field) => !String(shippingAddress[field] || "").trim()
      );

      if (missingField) {
        toast.error("Please complete your shipping address");
        return;
      }

      try {
        await dispatch(
          updateUserProfile({
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          })
        ).unwrap();
        setIsEditingAddress(false);
      } catch (error) {
        console.error("Profile update failed during checkout:", error);
        toast.error("Could not save address to profile, continuing with order");
      }
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: SHIPPING_COST,
        totalPrice: total,
      };

      const order = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === "COD") {
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate(`/order-confirmation?orderId=${order._id}`);
        return;
      }

      const paymentRes = await axiosInstance.post("/payment/create-razorpay-order", {
        orderId: order._id,
        amount: total,
      });

      const { razorpayOrderId, razorpayKeyId } = paymentRes.data;

      const options = {
        key: razorpayKeyId,
        amount: total * 100,
        currency: "INR",
        name: "Karigari",
        description: `Order ${order._id}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify-payment", {
              razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            });
            dispatch(clearCart());
            toast.success("Payment successful!");
            navigate(`/order-confirmation?orderId=${order._id}`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email: user.email,
          contact: user.phone,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow">
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8">
            {[["Address", 1], ["Payment", 2], ["Review", 3]].map(([label, s]) => (
              <div
                key={s}
                className={`flex-1 text-center border-b-2 pb-2 transition-colors ${
                  step >= s ? "border-black text-black font-semibold" : "border-gray-200 text-gray-400"
                }`}
              >
                <span className="hidden sm:inline">{s}. </span>{label}
              </div>
            ))}
          </div>

          {step === 1 && (!hasSavedAddress || isEditingAddress ? (
            <AddressForm
              shippingAddress={shippingAddress}
              onChange={handleChange}
              onSubmit={handleContinueToPayment}
              hasSavedAddress={hasSavedAddress}
              onCancel={() => setIsEditingAddress(false)}
            />
          ) : (
            <SavedAddressView
              shippingAddress={shippingAddress}
              onEdit={() => setIsEditingAddress(true)}
              onContinue={handleContinueToPayment}
            />
          ))}

          {step === 2 && (
            <PaymentMethodView
              paymentMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ReviewOrderView
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              creatingOrder={creatingOrder}
              loading={loading}
              cartItems={cartItems}
              onBack={() => setStep(2)}
              onPlaceOrder={handlePlaceOrder}
              onEditStep={setStep}
            />
          )}
        </div>

        {/* Order Summary Panel */}
        <div className="bg-white rounded-lg p-6 shadow sticky top-10 h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="space-y-4 border-b pb-4 mb-4 max-h-[40vh] overflow-y-auto pr-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Your cart is empty</p>
            ) : (
              cartItems.map((product) => (
                <div key={product.product} className="flex items-center gap-4">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{product.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {product.qty || 1}</p>
                  </div>
                  <p className="font-medium text-sm sm:text-base">
                    Rs {round2(Number(product.price || 0) * Number(product.qty || 1))}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rs {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Rs {SHIPPING_COST}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
