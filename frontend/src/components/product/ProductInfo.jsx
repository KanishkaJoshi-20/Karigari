import React, { useState } from 'react';

export default function ProductInfo({ product, handleAddToCart, handleBuyNow, isButtonDisabled }) {
    const defaultPrice = product?.price || 449;
    const oldPrice = Math.round(defaultPrice * 2);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold leading-tight mb-2">{product?.name || "Handmade Pastel Pink Crochet Hair Bow"}</h2>
                <div className="flex items-center gap-3">
                    {product?.rating > 0 && (
                        <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-bold">
                            {product.rating} <span className="material-symbols-outlined text-[16px] ml-1 fill-1">star</span>
                        </div>
                    )}
                    <span className="text-slate-500 text-sm">{product?.numReviews || 0} Reviews</span>
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold">₹{defaultPrice}</span>
                    <span className="text-slate-400 line-through text-lg font-medium">₹{oldPrice}</span>
                    <span className="text-primary font-bold text-lg">50% OFF</span>
                </div>
                <p className="text-slate-500 text-xs">Inclusive of all taxes</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">verified</span> Bestseller
                </span>
                <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">eco</span> 100% Cotton
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <button 
                    disabled={isButtonDisabled}
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-white border-2 border-primary text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {isButtonDisabled ? "Adding..." : "Add to Cart"}
                </button>
                <button 
                    disabled={isButtonDisabled}
                    onClick={handleBuyNow}
                    className={`flex-1 h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-opacity ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                >
                    <span className="material-symbols-outlined">bolt</span>
                    Buy Now
                </button>
            </div>

            {/* Delivery Checker */}
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    Delivery Options
                </h4>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50" placeholder="Enter Pincode" type="text" />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary font-bold text-sm">Check</button>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        Get it by <b>Tuesday, Oct 24</b>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                        Free delivery on orders above ₹999
                    </p>
                </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
                <div className="py-4">
                    <button className="w-full flex justify-between items-center text-left font-bold">
                        Description
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {product?.description || "Hand-crocheted with premium soft cotton yarn for a gentle touch and secure hold."}
                    </div>
                </div>
                <div className="py-4">
                    <button className="w-full flex justify-between items-center text-left font-bold">
                        Return Policy
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        This item is non-refundable due to its handmade nature. Please contact us for any manufacturing defects.
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">lock</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Secure Payments</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Top Quality</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">home_pin</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Made in India</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight">Fast Shipping</span>
                </div>
            </div>
        </div>
    );
}
