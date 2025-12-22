import React, { useEffect, useState } from 'react';

function ProductDetails() {
    const product = {
        name: "Crochet Flower",
        price: 80,
        originalPrice: 100,
        description: "A beautiful handmade crochet flower, perfect for decoration or gifting.",
        sizes: ["Small", "Medium", "Large"],
        colors: ["Red", "Yellow", "Blue"],
        images: [
            {
                url: "/productImg/Sunflower.jpeg",
                altText: "Sunflower Crochet Flower",
            },
            {
                url: "/productImg/Sunflower2.jpeg",
                altText: "Sunflower Crochet Flower Side View",
            },
        ],
    };

    const [mainImage, setMainImage] = useState(product.images[0].url);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                {/* Main Layout */}
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Thumbnails (Desktop) */}
                    <div className="hidden md:flex flex-col space-y-4">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={img.altText}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === img.url ? 'border-black' : 'border-gray-300'}`}
                                onClick={() => setMainImage(img.url)}
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src={mainImage}
                            alt={product.images[0].altText}
                            className="w-full max-w-md aspect-[3/4] object-cover rounded-lg"
                        />
                    </div>

                    {/* Mobile Thumbnails */}
                    <div className="md:hidden flex gap-4 overflow-x-auto mt-6">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={img.altText}
                                 className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === img.url ? 'border-black' : 'border-gray-300'}`}
                                onClick={() => setMainImage(img.url)}
                            />
                        ))}
                    </div>

                    {/* Right Details */}
                    <div className="md:w-1/2">
                        <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>

                        <div className="flex items-center mb-4">
                            <span className="text-xl font-semibold">₹{product.price}</span>
                            <span className="ml-2 text-lg text-gray-500 line-through">
                                ₹{product.originalPrice}
                            </span>
                        </div>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        {/* Sizes */}
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

                        {/* Colors */}
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
                        <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
