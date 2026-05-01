import express from "express";
import Order from "../models/order.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", asyncHandler(async (req, res, next) => {
  const orders = await Order.find({})
    .populate("user", "id name email")
    .sort({ createdAt: -1 });
  res.json(orders);
}));

router.put("/:id/deliver", asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
}));

export default router;
