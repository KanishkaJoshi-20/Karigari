import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { motion } from "framer-motion";
import { addToCartAsync } from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { toast } from "sonner";
import { FaFilter, FaTimes } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";
import Pagination from "../components/Common/Pagination";

const COLLECTIONS = [
  "All",
  "Hair Clip",
  "Claw Clips",
  "Keychains",
  "Bookmarker",
  "Bag Charm",
  "Earpod Case",
  "Hair Accessories",
  "Purse",
  "Top",
  "Poshak",
  "Earrings",
  "Flower Pot",
  "Specs Holder",
  "Rubber Bands",
  "Wishlist"
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Top Rated" },
];

const CollectionPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, currentPage = 1, totalPages = 1 } = useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const sidebarRef = useRef(null);

  const { collection } = useParams();

  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPageLocal,
      limit: 12,
      sort: sortBy,
      category: selectedCategory === "All" || selectedCategory === "Wishlist" ? "" : selectedCategory
    }));
  }, [dispatch, selectedCategory, sortBy, currentPageLocal]);

  useEffect(() => {
    if (collection) {
      const validCategory = COLLECTIONS.find(
        (c) => c.toLowerCase() === collection.toLowerCase()
      );
      setSelectedCategory(validCategory || "All");
      setCurrentPageLocal(1);
    }
  }, [collection]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({
      productId: product._id,
      quantity: 1
    }));
    toast.success('Product Added To Cart', { duration: 1000 });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPageLocal(1);
  };

  const handlePageChange = (page) => {
    setCurrentPageLocal(page);
    window.scrollTo(0, 0);
  };

  /* Filter & Sort Products */
  let filteredProducts = [];

  if (selectedCategory === "Wishlist") {
    filteredProducts = wishlistItems;
  } else {
    filteredProducts = products
      .filter((product) => {
        if (selectedCategory !== "All" && product.category !== selectedCategory) {
          return false;
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        return true;
      });
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden flex items-center gap-2 p-4 border-b bg-white sticky top-0 z-40"
      >
        <FaFilter />
        Filters
      </button>

      {/* Sidebar Filters */}
      <aside
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 transition-transform duration-300 overflow-y-auto
        lg:static lg:translate-x-0 lg:w-64 lg:border-r lg:border-gray-200`}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
        >
          <FaTimes />
        </button>

        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Collections</h3>
          <ul className="space-y-2">
            {COLLECTIONS.map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPageLocal(1);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedCategory === category
                    ? "bg-primary text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range Filter */}
        {selectedCategory !== "Wishlist" && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Price Range</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full cursor-pointer accent-primary"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                <span className="text-sm font-semibold text-primary">₹{priceRange[1]}</span>
              </div>
              <p className="text-xs text-gray-500">
                Showing products between ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
            </div>
          </div>
        )}

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSelectedCategory("All");
            setPriceRange([0, 5000]);
            setSortBy("newest");
            setCurrentPageLocal(1);
          }}
          className="w-full py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium"
        >
          Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6">
        {/* Header with Title and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold uppercase text-gray-900">
            {selectedCategory}
          </h2>

          {selectedCategory !== "Wishlist" && (
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Product Count */}
        <p className="text-sm text-gray-600 mb-6">
          {selectedCategory === "Wishlist"
            ? `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} in wishlist`
            : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
          }
        </p>

        {/* Loading & Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setPriceRange([0, 5000]);
                setSortBy("newest");
              }}
              className="text-primary font-semibold hover:underline"
            >
              Clear filters and view all products
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col relative overflow-hidden group"
                >
                  <Link to={`/product/${product._id}`} className="block relative h-56 w-full cursor-pointer overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(product.image || product.images?.[0]?.url)}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleWishlist(product));
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                      aria-label="Toggle wishlist"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${wishlistItems?.some(item => item._id === product._id) ? 'fill-1 text-primary' : 'text-slate-400'}`}>
                        favorite
                      </span>
                    </button>
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/product/${product._id}`} className="block hover:text-primary transition-colors">
                      <h3 className="font-semibold text-base line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mb-2">
                      {product.category}
                    </p>

                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.numReviews})</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                      <span className="font-bold text-lg text-primary">
                        ₹{product.price}
                      </span>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="bg-black text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800 focus:ring-2 focus:ring-primary/50 transition-colors z-10"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {!selectedCategory.includes("Wishlist") && filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPageLocal}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;
