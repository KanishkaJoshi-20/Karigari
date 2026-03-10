import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";
import { FaFilter } from "react-icons/fa";
import { getImageUrl } from "../utils/getImageUrl";

const COLLECTIONS = [
  "All",
  "Amigurumi Toys",
  "Home Décor",
  "Accessories",
  "Baby Essentials",
  "Gift Sets",
];

const CollectionPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

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
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={getImageUrl(product.image || product.images?.[0]?.url)}
                  alt={product.name}
                  className="h-56 w-full object-cover rounded-t-lg"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-lg">
                      ₹{product.price}
                    </span>

                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
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
