import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { getWishlist, addWishlistItem, removeWishlistItem, isProductInWishlist } from '../controllers/wishlist.controller.js';

const router = express.Router();

router.get('/', authenticateUser, getWishlist);
router.post('/add/:productId', authenticateUser, addWishlistItem);
router.delete('/remove/:productId', authenticateUser, removeWishlistItem);
router.get('/status/:productId', authenticateUser, isProductInWishlist);

export default router;
