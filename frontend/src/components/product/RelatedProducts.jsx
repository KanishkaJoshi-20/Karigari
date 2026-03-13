import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl } from '../../utils/getImageUrl';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
export default function RelatedProducts({ products }) {
    const dispatch = useDispatch();
    const { wishlistItems } = useSelector((state) => state.wishlist);

    if (!products || products.length === 0) return null;

    return (
        <section className="mt-16 space-y-6">
            <h3 className="text-2xl font-bold">You may also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product, idx) => {
                    const defaultPrice = product.price || 599;
                    const oldPrice = Math.round(defaultPrice * 1.5);
                    return (
                        <Link key={product._id} to={`/product/${product._id}`} className="group cursor-pointer block">
                            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white mb-3 relative">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    alt={product.name} 
                                    src={getImageUrl(product.image || product.images?.[0]?.url)} 
                                />
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(toggleWishlist(product));
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                >
                                    <span className={`material-symbols-outlined text-[16px] ${wishlistItems?.some(item => item._id === product._id) ? 'fill-1 text-primary' : 'text-slate-400'}`}>favorite</span>
                                </button>
                                {idx === 0 && <span className="absolute top-2 left-2 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">NEW</span>}
                                {idx === 1 && <span className="absolute top-2 left-2 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">BESTSELLER</span>}
                            </div>
                            <h4 className="font-bold text-sm truncate">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-sm">₹{defaultPrice}</span>
                                <span className="text-slate-400 text-xs line-through">₹{oldPrice}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
