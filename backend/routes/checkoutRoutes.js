import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addOrderItems, getOrderById, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;
