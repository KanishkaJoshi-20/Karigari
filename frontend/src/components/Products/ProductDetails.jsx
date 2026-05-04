import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchProducts } from '../../redux/slices/productSlice';
import { addToCartAsync } from '../../redux/slices/cartSlice';

import ProductGallery from '../product/ProductGallery';
import ProductInfo from '../product/ProductInfo';
import ProductReviews from '../product/ProductReviews';
import RelatedProducts from '../product/RelatedProducts';

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
            if (product.images?.length > 0) {
                setMainImage(product.images[0].url);
            } else if (product.image) {
                setMainImage(product.image);
            }
        }
    }, [product]);

    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!product) return;

        dispatch(addToCartAsync({
            productId: product._id,
            quantity: 1
        }));

        setIsButtonDisabled(true);
        setTimeout(() => {
            toast.success('Product Added To Cart', {
                duration: 1000,
            });
            setIsButtonDisabled(false);
        }, 500);
    }

    const handleBuyNow = () => {
        handleAddToCart();
        setTimeout(() => {
            navigate('/checkout');
        }, 500);
    }

    if (loading) return <div className="p-6 max-w-7xl mx-auto text-center font-bold text-primary">Loading...</div>;
    if (error) return <div className="p-6 max-w-7xl mx-auto text-center text-red-500">{error}</div>;

    // Use a static mockup product properties to match exact UI if fetching fails or isn't populated
    const safeProduct = product || {
        name: "Handmade Pastel Pink Crochet Hair Bow",
        category: "Hair Accessories",
        description: "Hand-crocheted with premium soft cotton yarn for a gentle touch and secure hold."
    };

    return (
        <React.Fragment>
            <main className="max-w-7xl mx-auto px-4 py-4 pb-24 text-slate-900 dark:text-slate-100 font-display">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <Link className="hover:text-primary" to="/">Home</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="hover:text-primary cursor-pointer">{safeProduct.category || "Products"}</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100">{safeProduct.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProductGallery 
                        product={safeProduct} 
                        mainImage={mainImage} 
                        setMainImage={setMainImage} 
                    />
                    
                    <div className="flex flex-col gap-6">
                        <ProductInfo 
                            product={safeProduct} 
                            handleAddToCart={handleAddToCart}
                            handleBuyNow={handleBuyNow}
                            isButtonDisabled={isButtonDisabled}
                        />
                    </div>
                </div>

                <ProductReviews product={safeProduct} />
                
                <RelatedProducts products={similarProducts} />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 flex justify-around p-3">
                <a className="flex flex-col items-center gap-1 text-primary" href="#">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-bold">Home</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
                    <span className="material-symbols-outlined">category</span>
                    <span className="text-[10px] font-bold">Categories</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
                    <span className="material-symbols-outlined">favorite</span>
                    <span className="text-[10px] font-bold">Wishlist</span>
                </a>
                <a className="flex flex-col items-center gap-1 text-slate-400" href="#">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold">Profile</span>
                </a>
            </div>

            {/* Floating WhatsApp Button */}
            <a className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" href="https://wa.me/#">
                <svg fill="currentColor" height="28px" viewBox="0 0 24 24" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.625 1.434h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
            </a>
        </React.Fragment>
    );
}

export default ProductDetails;
