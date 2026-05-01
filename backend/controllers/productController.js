import Product from "../models/product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Utility to replace missing/dummy local images with a robust generated placeholder
const formatProductImage = (productDoc) => {
  const p = typeof productDoc.toObject === 'function' ? productDoc.toObject() : productDoc;
  if (!p.image || p.image.startsWith("/uploads/") || p.image === "/images/sample.jpg") {
    // Generate an aesthetic placeholder holding the product's name
    p.image = `https://placehold.co/600x600/e2e8f0/1e293b?text=${encodeURIComponent(p.name || 'Product')}`;
  }
  return p;
};

export const getProducts = asyncHandler(async (req, res, next) => {
  const { keyword, category, sort, page: queryPage, limit: queryLimit } = req.query;

  // Build the dynamic filter
  const filter = {};

  if (keyword) {
    filter.name = {
      $regex: keyword,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  // Pagination defaults: page 1, 12 items per page
  const page = Math.max(1, Number(queryPage) || 1);
  const limit = Math.min(50, Math.max(1, Number(queryLimit) || 12));

  // Dynamic sort
  let sortObj = { createdAt: -1 }; // Default sort
  if (sort === "price_asc") {
    sortObj = { price: 1 };
  } else if (sort === "price_desc") {
    sortObj = { price: -1 };
  } else if (sort === "rating_desc") {
    sortObj = { rating: -1 };
  }

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(filter)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);

  const formattedProducts = products.map(formatProductImage);

  res.json({
    products: formattedProducts,
    currentPage: page,
    totalPages,
    totalProducts,
  });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(formatProductImage(product));
});
