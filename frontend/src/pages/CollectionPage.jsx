import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { toast } from "sonner";
import { FaFilter } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getImageUrl } from "../utils/getImageUrl";

const COLLECTIONS = [
  "All",
  "Amigurumi Toys",
  "Home Décor",
  "Accessories",
  "Baby Essentials",
  "Gift Sets",
  "Wishlist"
];

const CollectionPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { collection } = useParams();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (collection) {
        // Find if it's a valid category, if not fallback to 'All'
        const validCategory = COLLECTIONS.find(
            (c) => c.toLowerCase() === collection.toLowerCase()
        );
        setSelectedCategory(validCategory || "All");
    }
  }, [collection]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: getImageUrl(product.image || product.images?.[0]?.url),
      price: product.price,
      qty: 1,
      countInStock: product.countInStock || 10
    }));
    toast.success('Product Added To Cart', { duration: 1000 });
  };

  /* ---------------- FILTER ---------------- */
  let filteredProducts = [];
  if (selectedCategory === "All") {
    filteredProducts = products;
  } else if (selectedCategory === "Wishlist") {
    filteredProducts = wishlistItems;
  } else {
    filteredProducts = products.filter((product) => product.category === selectedCategory);
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden flex items-center gap-2 p-4 border-b bg-white"
      >
        <FaFilter />
        Filters
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white p-6 transition-transform duration-300
        lg:static lg:translate-x-0`}
      >
        <h3 className="text-lg font-bold mb-4">Collections</h3>

        <ul className="space-y-2">
          {COLLECTIONS.map((category) => (
            <li key={category}>
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold uppercase mb-6">
          {selectedCategory}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col relative"
              >
                <Link to={`/product/${product._id}`} className="block relative h-56 w-full cursor-pointer">
                    <img
                      src={getImageUrl(product.image || product.images?.[0]?.url)}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
                    />
                    <button 
                      onClick={(e) => {
                          e.preventDefault();
                          dispatch(toggleWishlist(product));
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${wishlistItems?.some(item => item._id === product._id) ? 'fill-1 text-primary' : 'text-slate-400'}`}>favorite</span>
                    </button>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`} className="block hover:underline">
                    <h3 className="font-semibold text-lg">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-500 mb-auto">
                    {product.category}
                  </p>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <span className="font-bold text-lg text-primary">
                      ₹{product.price}
                    </span>

                    <button 
                      onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                      }}
                      className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 focus:ring-2 focus:ring-primary/50 transition-colors z-10"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionPage;
