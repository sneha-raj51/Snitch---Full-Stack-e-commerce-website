import wishlistModel from '../models/wishlist.model.js';
import productModel from '../models/product.model.js';

export async function getWishlist(req, res) {
    try {
        const user = req.user;

        const wishlistItems = await wishlistModel.find({ user: user._id })
            .populate('product');

        return res.status(200).json({ message: 'Wishlist fetched successfully', success: true, wishlist: wishlistItems });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export async function addWishlistItem(req, res) {
    try {
        const user = req.user;
        const { productId } = req.params;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }

        const existing = await wishlistModel.findOne({ user: user._id, product: productId });
        if (existing) {
            return res.status(200).json({ message: 'Product already in wishlist', success: true, wishlistItem: existing });
        }

        const wishlistItem = await wishlistModel.create({ user: user._id, product: productId });
        const populatedItem = await wishlistItem.populate('product');

        return res.status(201).json({ message: 'Product added to wishlist', success: true, wishlistItem: populatedItem });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(200).json({ message: 'Product already in wishlist', success: true });
        }
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export async function removeWishlistItem(req, res) {
    try {
        const user = req.user;
        const { productId } = req.params;

        const wishlistItem = await wishlistModel.findOneAndDelete({ user: user._id, product: productId });
        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found', success: false });
        }

        return res.status(200).json({ message: 'Product removed from wishlist', success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}

export async function isProductInWishlist(req, res) {
    try {
        const user = req.user;
        const { productId } = req.params;

        const existing = await wishlistModel.findOne({ user: user._id, product: productId });
        return res.status(200).json({ message: 'Wishlist status fetched', success: true, inWishlist: Boolean(existing) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', success: false });
    }
}
