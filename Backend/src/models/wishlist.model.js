import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, { timestamps: true });

wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const wishlistModel = mongoose.model('wishlist', wishlistSchema);

export default wishlistModel;
