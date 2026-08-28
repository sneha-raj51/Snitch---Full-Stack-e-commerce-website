import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
    title: String,
    productId: mongoose.Schema.Types.ObjectId,
    variantId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    images: [ { url: String } ],
    description: String,
    price: priceSchema,
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment"
    },
    price: {
        type: priceSchema,
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: addressSchema,
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["Order Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Order Placed"
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    }
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
