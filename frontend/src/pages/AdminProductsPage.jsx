import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../redux/slices/adminSlice";
import { toast } from "sonner";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { getImageUrl } from "../utils/getImageUrl";

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  category: "Handmade",
  brand: "Karigari",
  countInStock: "",
  image: "",
};

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      image: product.image,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const imageUrl = await dispatch(uploadProductImage(formData)).unwrap();
      setForm((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...form, price: Number(form.price), countInStock: Number(form.countInStock) };

    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, productData })).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    console.log("Delete clicked for product:", id);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(typeof err === "string" ? err : "Delete failed: " + JSON.stringify(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <FaPlus /> Add Product
        </button>
      </div>

      {/* ─── FORM MODAL ─── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <FaTimes size={18} />
            </button>
            <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Product" : "Add Product"}</h2>

            <label className="block mb-1 text-sm font-medium">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2 rounded mb-3" />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Price (₹)</label>
                <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Stock</label>
                <input required type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} className="w-full border p-2 rounded" />
              </div>
            </div>

            <label className="block mb-1 text-sm font-medium">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border p-2 rounded mb-3">
              <option>Handmade</option>
              <option>Amigurumi Toys</option>
              <option>Home Décor</option>
              <option>Accessories</option>
              <option>Baby Essentials</option>
              <option>Gift Sets</option>
            </select>

            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea required rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded mb-3" />

            <label className="block mb-1 text-sm font-medium">Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
            {uploading && <p className="text-sm text-gray-500 mb-2">Uploading...</p>}
            {form.image && <img src={getImageUrl(form.image)} alt="preview" className="h-24 rounded mb-3 object-cover" />}

            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              {editingId ? "Update Product" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* ─── TABLE ─── */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3">
                    <img src={getImageUrl(p.image)} alt={p.name} className="h-12 w-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">{p.countInStock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-6 text-center text-gray-400">No products yet. Click "Add Product" to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
