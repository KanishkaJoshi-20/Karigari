import React from 'react';

export default function ProductReviews({ product }) {
    const rating = product?.rating || 4.8;
    const numReviews = product?.numReviews || 0;
    
    // Calculate star displays
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <section className="mt-16 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-extrabold">{rating}</div>
                        <div>
                            <div className="flex text-primary">
                                {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="material-symbols-outlined fill-1">star</span>)}
                                {hasHalfStar && <span className="material-symbols-outlined fill-1">star_half</span>}
                                {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="material-symbols-outlined">star</span>)}
                            </div>
                            <p className="text-xs text-slate-500">Based on {numReviews} reviews</p>
                        </div>
                    </div>
                </div>
                <button className="bg-primary/10 text-primary border border-primary/20 font-bold px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all">
                    Write a Review
                </button>
            </div>
            {/* Rating Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4">5</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[85%]"></div>
                        </div>
                        <span className="text-xs text-slate-500">85%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4">4</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 w-[10%]"></div>
                        </div>
                        <span className="text-xs text-slate-500">10%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4">3</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-[3%]"></div>
                        </div>
                        <span className="text-xs text-slate-500">3%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4">2</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 w-[1%]"></div>
                        </div>
                        <span className="text-xs text-slate-500">1%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4">1</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 w-[1%]"></div>
                        </div>
                        <span className="text-xs text-slate-500">1%</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
