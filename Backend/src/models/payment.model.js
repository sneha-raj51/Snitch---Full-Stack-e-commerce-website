import mongoose from "mongoose";
import priceSchema from "./price.schema.js";


const paymentSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: [ "pending", "paid", "failed" ],
        default: "pending"
    },
    price: {
        type: priceSchema,
        required: true
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    fromCart: {
        type: Boolean,
        default: true
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        line1: String,
        line2: String,
        country: String,
        state: String,
        city: String,
        pinCode: String,
        addressType: {
            type: String,
            enum: ["Home", "Work", "Other"],
            default: "Home"
        }
    },
    orderItems: [
        {
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
        }
    ]
})

const paymentModel = mongoose.model("payment", paymentSchema)

export default paymentModel;