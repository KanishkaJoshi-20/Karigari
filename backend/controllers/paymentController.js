// backend/controllers/paymentController.js
import Payment from '../models/payment.js';
import Order from '../models/order.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/razorpayService.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    // Verify order exists and user owns it
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayService.createRazorpayOrder(
      amount,
      `Order ${orderId}`
    );

    // Save payment record
    const payment = new Payment({
      razorpayOrderId: razorpayOrder.id,
      order: orderId,
      amount,
      currency: 'INR',
      status: 'pending',
    });
    await payment.save();

    res.json({
      success: true,
      orderId,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature (CRITICAL SECURITY STEP)
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      res.status(400);
      throw new Error('Payment signature verification failed');
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'success',
      },
      { new: true }
    );

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: new Date(),
        paymentId: payment._id,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    // Update payment status to failed
    if (req.body.razorpayOrderId) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: req.body.razorpayOrderId },
        { status: 'failed' }
      );
    }
    next(error);
  }
};