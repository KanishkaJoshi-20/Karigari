import Order from "../models/order.js";
import asyncHandler from "../middleware/asyncHandler.js";

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

  res.status(201).json(order);
});

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
