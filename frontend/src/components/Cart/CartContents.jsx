import { Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCartAsync, addToCartAsync } from '../../redux/slices/cartSlice';
import { getImageUrl } from '../../utils/getImageUrl';

const CartContents = () => {
    const dispatch = useDispatch();
    const { cartItems: cartProducts } = useSelector((state) => state.cart);

    const handleRemove = (itemId) => {
        dispatch(removeFromCartAsync(itemId));
    };

    const updateQuantity = (item, newQty) => {
        if (newQty < 1) return;
        dispatch(addToCartAsync({ productId: item.product._id, quantity: newQty - item.quantity }));
    };

    return (
        <div>
            {cartProducts.length === 0 ? (
                <p className="p-4 text-gray-400">Your cart is empty.</p>
            ) : (
                cartProducts.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-start justify-between py-4 border-b"
                    >
                        <div className="flex items-start">
                            <img
                                src={getImageUrl(item.product.image)}
                                alt={item.product.name}
                                className="h-24 w-20 object-cover mr-4 rounded"
                            />
                            <div className="flex flex-col">
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    ₹{item.product.price}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                            <button onClick={() => handleRemove(item._id)}>
                                <Trash className="h-5 w-5 mt-2 text-red-600 hover:text-red-800" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CartContents;