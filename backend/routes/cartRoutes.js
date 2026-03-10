import express from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error("productId is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 1) {
      res.status(400);
      throw new Error("Quantity must be at least 1");
    }

    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });
    if (cartItem) {
      cartItem.quantity = qty;
      cartItem = await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity: qty,
      });
    }

    const populatedItem = await cartItem.populate("product");
    res.status(201).json(populatedItem);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", protect, async (req, res, next) => {
  try {
    // Users can only read their own cart unless they are admin.
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) {
      res.status(403);
      throw new Error("Not authorized to view this cart");
    }

    const cartItems = await Cart.find({ user: req.params.userId }).populate("product");
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
});

router.delete("/:itemId", protect, async (req, res, next) => {
  try {
    const cartItem = await Cart.findById(req.params.itemId);
    if (!cartItem) {
      res.status(404);
      throw new Error("Cart item not found");
    }

    if (!req.user.isAdmin && cartItem.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this item");
    }

    await cartItem.deleteOne();
    res.json({ message: "Cart item removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
