import { Router } from "express";
import { authenticateUser, authenticateSeller } from "../middlewares/auth.middleware.js";
import { getOrders, getOrderById, getSellerOrders, updateOrderStatus, getSellerDashboardStats } from "../controllers/order.controller.js";

const router = Router();

// Seller Routes (Must be before /:orderId to avoid matching conflict)
router.get('/seller/stats', authenticateSeller, getSellerDashboardStats);
router.get('/seller', authenticateSeller, getSellerOrders);
router.patch('/:orderId/status', authenticateSeller, updateOrderStatus);

// Buyer Routes
router.get('/', authenticateUser, getOrders);
router.get('/:orderId', authenticateUser, getOrderById);

export default router;
