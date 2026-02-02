import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Sunflower from "/productImg/Sunflower.jpeg";
import CherryClip from "/productImg/CherryClip.jpeg";

const CART_DATA = {
    products: [
        {
            productId: 1,
            name: "Crochet Flower",
            type: "Sunflower",
            color: "Yellow+Brown",
            quantity: 1,
            price: 80,
            image: Sunflower,
        },
        {
            productId: 2,
            name: "Crochet HairClip",
            type: "CherryClip",
            color: "Red+Green",
            quantity: 1,
            price: 50,
            image: CherryClip,
        },
    ],
    subtotal: 130,
};

const SHIPPING_COST = 20;

const Checkout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        for (let key in shippingAddress) {
            if (!shippingAddress[key]) {
                toast.error("Please fill all fields");
                setLoading(false);
                return;
            }
        }

        try {
            // Add API call here later
            toast.success("Order Placed Successfully 🎉");
            setTimeout(() => {
                navigate("/order-success");
            }, 1000);
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const total = CART_DATA.subtotal + SHIPPING_COST;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {/* LEFT SECTION */}
                <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-2xl uppercase mb-6 font-semibold">Checkout</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Details</h3>

                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={shippingAddress.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
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
                                    required
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
                                    required
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "PLACE ORDER"}
                        </button>
                    </form>
                </div>

                {/* RIGHT SECTION (ORDER SUMMARY) */}
                <div className="bg-white rounded-lg p-6 shadow sticky top-10">
                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-4 border-b pb-4 mb-4">
                        {CART_DATA.products.map((product) => (
                            <div key={product.productId} className="flex items-center gap-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-gray-500 text-sm">{product.color}</p>
                                    <p className="text-gray-500 text-sm">Qty: {product.quantity}</p>
                                </div>
                                <p className="font-medium">₹{product.price}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{CART_DATA.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{SHIPPING_COST}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
