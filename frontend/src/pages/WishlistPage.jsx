import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const { wishlistItems, loading } = useSelector((state) => state.wishlist);
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">account_circle</span>
                <h2 className="text-2xl font-bold mb-2">Please Login</h2>
                <p className="text-slate-500 mb-6 max-w-md">You need to be logged in to view and save items to your wishlist.</p>
                <Link to="/login?redirect=/wishlist" className="bg-primary text-white px-6 py-2 rounded">
                    Login to Continue
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-8xl text-rose-100 mb-4">favorite</span>
                    <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-slate-500 mb-8 max-w-md">You haven't saved any items yet. Explore our collections and find something you love!</p>
                    <Link to="/" className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded text-lg font-medium transition-colors">
                        Explore Products
                    </Link>
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {wishlistItems.map((product) => (
                        <motion.div
                            key={product._id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to={`/product/${product._id}`} className="group relative block border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow bg-white h-full">
                                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/80 p-2 rounded-full pointer-events-none">
                                        <span className="material-symbols-outlined fill-1 text-primary text-lg">favorite</span>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-medium mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-semibold text-lg text-primary">₹{product.price}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default WishlistPage;
