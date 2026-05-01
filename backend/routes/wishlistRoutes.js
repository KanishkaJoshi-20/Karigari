import express from "express";
import Wishlist from "../models/wishlist.js";
import Product from "../models/product.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// GET /api/wishlist - Get current user's wishlist
router.get(
    "/",
    protect,
    asyncHandler(async (req, res, next) => {
        const wishlistItems = await Wishlist.find({ user: req.user._id }).populate("product");

        // Filter out deleted products and auto clean them
        const validItems = [];
        const orphanedIds = [];

        for (const item of wishlistItems) {
            if (item.product) {
                validItems.push(item);
            } else {
                orphanedIds.push(item._id);
            }
        }

        if (orphanedIds.length > 0) {
            Wishlist.deleteMany({ _id: { $in: orphanedIds } }).catch(() => { });
        }

        res.json(validItems);
    })
);

// POST /api/wishlist - Add product to wishlist
router.post(
    "/",
    protect,
    asyncHandler(async (req, res, next) => {
        const { productId } = req.body;

        if (!productId) {
            res.status(400);
            throw new Error("productId is required");
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        // Upsert equivalent / avoidance of duplicate thanks to schema index
        const existing = await Wishlist.findOne({ user: req.user._id, product: productId });
        if (existing) {
            // If it exists, gracefully just return it
            const populatedItem = await existing.populate("product");
            return res.status(200).json(populatedItem);
        }

        const wishlistItem = await Wishlist.create({
            user: req.user._id,
            product: productId,
        });

        const populatedItem = await wishlistItem.populate("product");
        res.status(201).json(populatedItem);
    })
);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete(
    "/:productId",
    protect,
    asyncHandler(async (req, res, next) => {
        const wishlistItem = await Wishlist.findOne({ user: req.user._id, product: req.params.productId });

        if (!wishlistItem) {
            res.status(404);
            throw new Error("Product not found in wishlist");
        }

        await wishlistItem.deleteOne();
        res.json({ message: "Product removed from wishlist", productId: req.params.productId });
    })
);

export default router;
