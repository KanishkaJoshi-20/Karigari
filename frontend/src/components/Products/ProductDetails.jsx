import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { getImageUrl } from '../../utils/getImageUrl';

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { productDetails: product, products: allProducts, loading, error } = useSelector((state) => state.products);

    // Dynamic similar products: same category, excluding current product
    const similarProducts = product
      ? allProducts
          .filter((p) => p._id !== product._id && p.category === product.category)
          .slice(0, 4)
      : [];

    const [mainImage, setMainImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
        if (allProducts.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (product) {
            setMainImage(product.image || "");
            // If the model had sizes/colors array
            // setSelectedSize(product.sizes?.[0] || "");
            // setSelectedColor(product.colors?.[0] || "");
        }
    }, [product]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setMainImage(product.images[0].url);
        }
    }, [product]);

    const handleAddToCart = () => {
        // If the backend had sizes and colors we would validate:
        // if (!selectedSize || !selectedColor) {
        //     toast.error("Please Select the size and color before adding to cart", {
        //         duration: 1000,
        //     });
        //     return;
        // }

        if (!product) return;

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            size: selectedSize,
            color: selectedColor,
            qty: quantity,
            countInStock: product.countInStock || 10
        }));

        setIsButtonDisabled(true);
        setTimeout(() => {
            toast.success('Product Added To Cart', {
                duration: 1000,
            });
            setIsButtonDisabled(false);
        }, 500)
    }

    if (loading) return <div className="p-6 max-w-6xl mx-auto text-center">Loading...</div>;
    if (error) return <div className="p-6 max-w-6xl mx-auto text-center text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                {/* Main Layout */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Thumbnails (Desktop) */}
                    <div className="hidden md:flex flex-col space-y-4">
                        {/* Currently using single image from model, mapping it once to simulate */}
                        {product.image && (
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === product.image ? 'border-black' : 'border-gray-300'}`}
                                onClick={() => setMainImage(product.image)}
                            />
                        )}
                    </div>

                    {/* Main Image */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src={getImageUrl(mainImage || product.image)}
                            alt={product.name}
                            className="w-full max-w-md aspect-[3/4] object-cover rounded-lg"
                        />
                    </div>

                    {/* Mobile Thumbnails */}
                    <div className="md:hidden flex gap-4 overflow-x-auto mt-6">
                        {product.image && (
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === product.image ? 'border-black' : 'border-gray-300'}`}
                                onClick={() => setMainImage(product.image)}
                            />
                        )}
                    </div>

                    {/* Right Details */}
                    <div className="md:w-1/2">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

                        <div className="flex items-center mb-4">
                            <span className="text-xl font-semibold">₹{product.price}</span>
                        </div>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Sizes:</h3>
                                <div className="flex gap-2">
                                    {product.sizes.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${selectedSize === size ? 'bg-gray-300 border border-black' : ''}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Colors:</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border ${color === "Red"
                                                ? "bg-red-500"
                                                : color === "Yellow"
                                                    ? "bg-yellow-400"
                                                    : "bg-blue-500"
                                                } ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <p className="flex items-center space-x-4">Quantity:</p>
                            <div>
                                <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className='border rounded px-2 py-1 text-xl font-medium'>
                                    -
                                </button>
                                <span className='mx-4 text-lg'>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className='border rounded px-2 py-1 text-xl font-medium'>
                                    +
                                </button>
                            </div>
                        </div>
                        <button
                            className={`w-full bg-gray-900 text-white py-3 rounded-lg
                            ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}
                            transition`}
                            disabled={isButtonDisabled}
                            onClick={handleAddToCart}
                        >
                            {isButtonDisabled ? "Adding..." : "ADD TO CART"}
                        </button>
                    </div>
                </div>

                {/* You May Also Like Section */}
                <div className="mt-20">
                    <h2 className="text-2xl text-center font-medium mb-4">
                        You May Also Like
                    </h2>
                    <ProductGrid products={similarProducts}/>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
