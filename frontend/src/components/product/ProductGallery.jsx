import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl } from '../../utils/getImageUrl';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';

export default function ProductGallery({ product, mainImage, setMainImage }) {
    const dispatch = useDispatch();
    const { wishlistItems } = useSelector((state) => state.wishlist);
    
    // Check if the current product is in the wishlist
    const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

    // Determine the images to show
    let images = [];
    if (product?.images?.length) {
        images = product.images.map(img => getImageUrl(img.url));
    } else if (product?.image) {
        images = [getImageUrl(product.image)];
    }

    // Fallback static images to match the provided HTML if dynamic ones aren't enough
    const fallbackImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDAswaPCY5Dwf5FScjPVDsTLHM-f4qQKFlIhLcg8GzFTpGYPKAVnzR01zLvyDWcY-dQMZ4EbL920fynyF79vc3OYiDNg4PLjpRF3JLXleFPkQ_iSiIOIpWsU2EGiaaAMoKbjXd_uWlwGUGTkqhFH-CZAFIwDFuPibDAcGNGBn3b9JSGPfdi_69CJBPD5CnZvXFwjtuSs-DhFmHMxIDED00AFckrldI30tsZctNsEeAbvDqTcG_LGh1l_OfW2fiYtTJqwGLYaoarsFoM",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA9JLuqJBTEolQGHHi9LfevmiQhRFcZbaaGz1KerQNZWerzh-KHx5qt4Gql_A1EN1OwfII71lL3U22aKUSLWTJUUrV4M6eD85m2DJxla7O5KHEIuJhyvaiB8XYnhQJcuJt3qgZiTnG7QlxEnwPW8trXPE04zqQXMSIKYrPdiCkDMxLVhzUj3geh8KUxBM00DqzjoHDbWM0qp5gFhd8kjCL-C2R3VDVlixWojxrF8na9YpCDib3zK7milU4CVdMNsp2kOPfiYfvm9hGz",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBggX-LRpF2s9q_-Q-EbkQg9aYB7CgZ66ZpanpkWTs7_MfgGidSGalIPaPIc2RwxnZTDfrICb7jNMWRT354dqCNbHJdLQG2JRz4OdOFyXm_75rqHTTORAf7y27tlCaEBk9quz5m-Ro_51UdkJ9j__cxO4idez0RyojrGE6Ci49BgK5vjgXxbanEx4FO5e4smyi81GPv84avMCssHN1PWuMh0SgIH6m4QNFuEX7RMf9M6SlDJhmBW5TF5vfjs0ax33VvCI_BhnNqZ7NI",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBJXXh7-cQ0ZZ_ek2eJWptpt69g7NeKzqEQXL-rJooRZPCAijKt-YBOK8LqHBi1JtIhrWyKa66_LYRfFtQUKQMy09UzAmkgf7bUV8Q1W6eKA77V5g5Zyhrbqso8Bo-8hfmge8fJqcaWT9lYKMNbUp1jAhIHzAymTld8y6PH6m0Hwy13NB8_EzS45iEN9na02YwhsPSz3J5SgJilUFG3EbvIhPIiP8IRMjb4Zcx3XZhvwOAcEPzbgpTLwk1HJY9ygsv6dVPwQZ8g290O"
    ];

    const displayImages = images.length > 0 ? images : fallbackImages;
    const currentMainImage = mainImage || displayImages[0];

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (product) {
            dispatch(toggleWishlist(product));
        }
    };

    return (
        <div className="space-y-4">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-sm relative group">
                <img 
                    className="w-full h-full object-cover" 
                    alt={product?.name || "Product"} 
                    src={currentMainImage}
                />
                <button 
                    onClick={handleWishlistClick}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                    <span className={`material-symbols-outlined ${isWishlisted ? 'fill-1 text-primary' : 'text-slate-400'}`}>favorite</span>
                </button>
                <div className="absolute bottom-4 left-4 bg-primary/90 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Handmade with Love
                </div>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {displayImages.map((img, idx) => (
                    <div 
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer ${currentMainImage === img ? 'border-primary' : 'border-transparent border-slate-200'}`}
                    >
                        <img className="w-full h-full object-cover" src={img} alt={`Thumbnail ${idx}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
