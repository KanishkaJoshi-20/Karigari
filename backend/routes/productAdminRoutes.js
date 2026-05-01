import express from "express";
import Product from "../models/product.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
} from "../validators/productValidators.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(protect, admin);

router.post("/", validateCreateProduct, validate, asyncHandler(async (req, res, next) => {
  const payload = {
    name: req.body.name || "Sample Crochet Product",
    image: req.body.image || "/uploads/sample.jpg",
    brand: req.body.brand || "Karigari",
    category: req.body.category || "Handmade",
    description: req.body.description || "Handcrafted crochet product.",
    price: Number(req.body.price ?? 0),
    countInStock: Number(req.body.countInStock ?? 0),
    rating: Number(req.body.rating ?? 0),
    numReviews: Number(req.body.numReviews ?? 0),
  };

  if (Number.isNaN(payload.price) || Number.isNaN(payload.countInStock)) {
    res.status(400);
    throw new Error("Invalid numeric values for price or countInStock");
  }

  const product = await Product.create({
    ...payload,
  });

  res.status(201).json(product);
}));

router.put("/:id", validateProductId, validateUpdateProduct, validate, asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updates = {
    name: req.body.name,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  };

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  if (updates.price !== undefined) {
    updates.price = Number(updates.price);
    if (Number.isNaN(updates.price)) {
      res.status(400);
      throw new Error("Invalid price value");
    }
  }

  if (updates.countInStock !== undefined) {
    updates.countInStock = Number(updates.countInStock);
    if (Number.isNaN(updates.countInStock)) {
      res.status(400);
      throw new Error("Invalid countInStock value");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(updatedProduct);
}));

router.delete("/:id", validateProductId, validate, asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ message: "Product removed" });
}));

export default router;
