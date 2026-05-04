import { Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, addToCart } from '../../redux/slices/cartSlice';
import { getImageUrl } from '../../utils/getImageUrl';

const CartContents = () => {
    const dispatch = useDispatch();
    const { cartItems: cartProducts } = useSelector((state) => state.cart);

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const updateQuantity = (product, newQty) => {
        if (newQty < 1) return;
        dispatch(addToCart({ ...product, qty: newQty }));
    };

    return (
        <div>
            {cartProducts.length === 0 ? (
                <p className="p-4 text-gray-400">Your cart is empty.</p>
            ) : (
                cartProducts.map((product) => (
                    <div
                        key={product.product}
                        className="flex items-start justify-between py-4 border-b"
                    >
                        <div className="flex items-start">
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className="h-24 w-20 object-cover mr-4 rounded"
                            />
                            <div className="flex flex-col">
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                    ₹{product.price}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => updateQuantity(product, (product.qty || 1) - 1)}
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{product.qty || 1}</span>
                                    <button
                                        onClick={() => updateQuantity(product, (product.qty || 1) + 1)}
                                        className="border rounded px-2 py-1 text-xl font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">₹{(product.price * (product.qty || 1)).toLocaleString()}</p>
                            <button onClick={() => handleRemove(product.product)}>
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