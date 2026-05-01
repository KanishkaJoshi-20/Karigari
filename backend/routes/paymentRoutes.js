import express from "express";
import crypto from "crypto";
import Order from "../models/order.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// Initialize Razorpay lazily (env vars loaded by the time a request arrives)
let razorpayInstance;
async function getRazorpay() {
  if (!razorpayInstance) {
    const { default: Razorpay } = await import("razorpay");
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order for a given internal order.
 */
router.post("/create-order", asyncHandler(async (req, res, next) => {
  const { amount, orderId } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("A valid amount is required");
  }

  // If an orderId is provided, verify the order exists and belongs to the user
  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to pay for this order");
    }
    if (order.isPaid) {
      res.status(400);
      throw new Error("Order is already paid");
    }
  }

  const razorpay = await getRazorpay();

  const options = {
    amount: Math.round(amount * 100), // convert to paise (integer)
    currency: "INR",
    receipt: orderId ? `order_${orderId}` : `receipt_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    order: razorpayOrder,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
}));

/**
 * POST /api/payment/verify-payment
 * Verifies Razorpay signature and marks the order as paid.
 *
 * Expected body:
 *   - razorpay_order_id    (from Razorpay checkout)
 *   - razorpay_payment_id  (from Razorpay checkout)
 *   - razorpay_signature   (from Razorpay checkout)
 *   - orderId              (internal order _id)
 */
router.post("/verify-payment", asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  // ── 1. Validate required fields ──────────────────────────────
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing Razorpay payment details");
  }

  if (!orderId) {
    res.status(400);
    throw new Error("Order ID is required");
  }

  // ── 2. Verify Razorpay signature (CRITICAL SECURITY STEP) ───
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment signature verification failed");
  }

  // ── 3. Find and validate the order ──────────────────────────
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this order");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // ── 4. Update order as paid ─────────────────────────────────
  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: "success",
  };

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: "Payment verified and order updated",
    order: updatedOrder,
  });
}));

export default router;