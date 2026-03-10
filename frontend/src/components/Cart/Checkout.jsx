import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { updateUserProfile, getUserProfile } from "../../redux/slices/authSlice";
import { getImageUrl } from "../../utils/getImageUrl";

const SHIPPING_COST = 50;

const round2 = (num) => Math.round((Number(num) + Number.EPSILON) * 100) / 100;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { loading: creatingOrder } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");

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
    () => round2(cartItems.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 1), 0)),
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
    if (!hasSavedAddress) {
      setIsEditingAddress(true);
      return;
    }
    setIsEditingAddress(false);
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
      const missingField = requiredFields.find((field) => !String(shippingAddress[field] || "").trim());

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
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: Number(item.qty || 1),
        image: item.image,
        price: Number(item.price || 0),
        product: item.product,
      })),
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: SHIPPING_COST,
      totalPrice: total,
    };

    try {
      const order = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully");
      navigate(`/order-confirmation?orderId=${order._id}`);
    } catch (error) {
      console.error("Create order failed:", error);
      toast.error(error || "Failed to place order");
    }
  };

  const AddressForm = () => (
    <form onSubmit={handleContinueToPayment} className="space-y-4">
      <h3 className="text-lg font-medium">Contact Details</h3>

      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={shippingAddress.email}
          onChange={handleChange}
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
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={shippingAddress.lastName}
            onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
          onChange={handleChange}
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
            onClick={() => setIsEditingAddress(false)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  const SavedAddressView = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Delivery Address</h3>
        <button
          type="button"
          onClick={() => setIsEditingAddress(true)}
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
        {shippingAddress.email ? <p className="text-gray-500 text-sm">{shippingAddress.email}</p> : null}
      </div>

      <button
        type="button"
        onClick={handleContinueToPayment}
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
      >
        CONTINUE TO PAYMENT
      </button>
    </div>
  );

  const PaymentMethodView = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
      <div className="space-y-4">
        <label className={`block border p-4 rounded cursor-pointer ${paymentMethod === "COD" ? "border-black bg-gray-50" : "border-gray-200"}`}>
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="COD" 
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="w-5 h-5 accent-black"
            />
            <span className="font-medium">Cash on Delivery (COD)</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 ml-8">Pay with cash when your order is delivered.</p>
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
            <span className="font-medium flex items-center gap-2">Credit / Debit Card <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-bold">Coming Soon</span></span>
          </div>
          <p className="text-gray-500 text-sm mt-2 ml-8">Online payments will be available shortly.</p>
        </label>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
        >
          Back to Address
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
        >
          CONTINUE TO REVIEW
        </button>
      </div>
    </div>
  );

  const ReviewOrderView = () => (
    <div>
      <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-700">Shipping to</h4>
          <button onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">Edit</button>
        </div>
        <p className="text-gray-600 text-sm">
          {shippingAddress.firstName} {shippingAddress.lastName} <br/>
          {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-700">Payment Method</h4>
          <button onClick={() => setStep(2)} className="text-sm text-blue-600 hover:underline">Edit</button>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={creatingOrder}
          className="w-1/3 bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={creatingOrder || cartItems.length === 0}
          className="w-2/3 bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {creatingOrder ? "PROCESSING..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow">
          {/* Progress Steps Header */}
          <div className="flex justify-between items-center mb-8">
            <div className={`flex-1 text-center border-b-2 pb-2 transition-colors ${step >= 1 ? 'border-black text-black font-semibold' : 'border-gray-200 text-gray-400'}`}>
              <span className="hidden sm:inline">1. </span>Address
            </div>
            <div className={`flex-1 text-center border-b-2 pb-2 transition-colors ${step >= 2 ? 'border-black text-black font-semibold' : 'border-gray-200 text-gray-400'}`}>
              <span className="hidden sm:inline">2. </span>Payment
            </div>
            <div className={`flex-1 text-center border-b-2 pb-2 transition-colors ${step >= 3 ? 'border-black text-black font-semibold' : 'border-gray-200 text-gray-400'}`}>
              <span className="hidden sm:inline">3. </span>Review
            </div>
          </div>

          {step === 1 && (!hasSavedAddress || isEditingAddress ? <AddressForm /> : <SavedAddressView />)}
          {step === 2 && <PaymentMethodView />}
          {step === 3 && <ReviewOrderView />}
        </div>

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
                  <p className="font-medium text-sm sm:text-base">Rs {round2(Number(product.price || 0) * Number(product.qty || 1))}</p>
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
