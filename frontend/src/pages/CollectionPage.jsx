import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";

const COLLECTIONS = [
  "All",
  "Amigurumi Toys",
  "Home Décor",
  "Accessories",
  "Baby Essentials",
  "Gift Sets",
];

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* ---------------- MOCK DATA ---------------- */
  useEffect(() => {
    const fetchedProducts = [
      {
        _id: 1,
        name: "Crochet Teddy Bear",
        price: 899,
        category: "Amigurumi Toys",
        image: "https://picsum.photos/500/500?random=1",
      },
      {
        _id: 2,
        name: "Crochet Bunny",
        price: 799,
        category: "Amigurumi Toys",
        image: "https://picsum.photos/500/500?random=2",
      },
      {
        _id: 3,
        name: "Crochet Flower Pot",
        price: 499,
        category: "Home Décor",
        image: "https://picsum.photos/500/500?random=3",
      },
      {
        _id: 4,
        name: "Crochet Cushion Cover",
        price: 699,
        category: "Home Décor",
        image: "https://picsum.photos/500/500?random=4",
      },
      {
        _id: 5,
        name: "Crochet Handbag",
        price: 1299,
        category: "Accessories",
        image: "https://picsum.photos/500/500?random=5",
      },
      {
        _id: 6,
        name: "Crochet Beanie Cap",
        price: 599,
        category: "Accessories",
        image: "https://picsum.photos/500/500?random=6",
      },
      {
        _id: 7,
        name: "Crochet Baby Booties",
        price: 399,
        category: "Baby Essentials",
        image: "https://picsum.photos/500/500?random=7",
      },
      {
        _id: 8,
        name: "Crochet Baby Blanket",
        price: 1499,
        category: "Baby Essentials",
        image: "https://picsum.photos/500/500?random=8",
      },
      {
        _id: 9,
        name: "Crochet Gift Hamper",
        price: 1999,
        category: "Gift Sets",
        image: "https://picsum.photos/500/500?random=9",
      },
    ];

    setProducts(fetchedProducts);
  }, []);

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

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={product.image}
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

                    <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
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
