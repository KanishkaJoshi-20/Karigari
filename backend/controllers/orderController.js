import Order from "../models/order.js";
import User from "../models/user.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";
import orderConfirmationTemplate from "../utils/emailTemplates.js";

export const addOrderItems = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (
    !shippingAddress?.address ||
    !shippingAddress?.city ||
    !shippingAddress?.postalCode ||
    !shippingAddress?.country
  ) {
    res.status(400);
    throw new Error("Incomplete shipping address");
  }

  if (!paymentMethod) {
    res.status(400);
    throw new Error("Payment method is required");
  }

  const normalizedItemsPrice = Number(itemsPrice);
  const normalizedShippingPrice = Number(shippingPrice);
  const normalizedTotalPrice = Number(totalPrice);

  if (
    Number.isNaN(normalizedItemsPrice) ||
    Number.isNaN(normalizedShippingPrice) ||
    Number.isNaN(normalizedTotalPrice)
  ) {
    res.status(400);
    throw new Error("Invalid order pricing values");
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: normalizedItemsPrice,
    shippingPrice: normalizedShippingPrice,
    totalPrice: normalizedTotalPrice,
  });

  // ✅ Respond immediately — do NOT await email sending
  res.status(201).json(order);

  // 🔥 Fire-and-forget: send confirmation email AFTER response
  // This does NOT block the API response or affect it even if it fails
  sendOrderConfirmationEmail(order, req.user).catch((err) => {
    console.error("[Email] Order confirmation failed:", err.message);
  });
});

/**
 * Sends an order confirmation email to the customer.
 * Fetches full user details (name + email) from the DB.
 * This is intentionally NOT awaited in the route handler.
 *
 * @param {Object} order   - Saved Mongoose order document
 * @param {Object} reqUser - Minimal user object from req.user (has _id)
 */
async function sendOrderConfirmationEmail(order, reqUser) {
  // req.user may not have email populated — fetch from DB to be safe
  const user = await User.findById(reqUser._id).select("name email").lean();

  if (!user?.email) {
    console.warn("[Email] User email not found, skipping confirmation.");
    return;
  }

  const html = orderConfirmationTemplate({
    customerName: user.name,
    orderId: order._id,
    orderItems: order.orderItems,
    itemsPrice: order.itemsPrice,
    shippingPrice: order.shippingPrice,
    totalPrice: order.totalPrice,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
  });

  await sendEmail({
    to: user.email,
    subject: `Order Confirmed ✅ — Karigari #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  });
}

export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});
