import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    const cart = (await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product'
            }
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                itemVariant: {
                    $let: {
                        vars: {
                            matchedVariant: {
                                $filter: {
                                    input: '$product.variants',
                                    as: 'variant',
                                    cond: {
                                        $eq: [
                                            '$$variant._id',
                                            '$items.variant'
                                        ]
                                    }
                                }
                            }
                        },
                        in: { $arrayElemAt: ['$$matchedVariant', 0] }
                    }
                }
            }
        },
        {
            $addFields: {
                'items.product': '$product',
                'items.variantDetails': '$itemVariant',
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            {
                                $cond: [
                                    { $ifNull: ['$itemVariant.price.amount', false] },
                                    '$itemVariant.price.amount',
                                    '$product.price.amount'
                                ]
                            }
                        ]
                    },
                    currency: {
                        $cond: [
                            { $ifNull: ['$itemVariant.price.currency', false] },
                            '$itemVariant.price.currency',
                            '$product.price.currency'
                        ]
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: { $first: '$itemPrice.currency' },
                items: { $push: '$items' }
            }
        }
    ]))[0]

    return cart
}