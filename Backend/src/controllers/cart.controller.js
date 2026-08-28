import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import paymentModel from "../models/payment.model.js";
import orderModel from "../models/order.model.js";
import { getCartDetails } from "../dao/cart.dao.js";
import { createOrder } from "../services/payment.service.js";
import { config } from "../config/config.js";
import crypto from "crypto";

export async function addToCart(req, res) {
    try {
        const { productId, variantId } = req.params;
        const quantity = Number(req.body.quantity) || 1;
        const user = req.user;

        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found", success: false });

        const variant = variantId ? product.variants.id(variantId) : null;
        const price = (variant && variant.price) ? variant.price : product.price;

        let cart = await cartModel.findOne({ user: user._id });
        if (!cart) {
            cart = await cartModel.create({ user: user._id, items: [] });
        }

        const existingItem = cart.items.find(i => {
            const sameProduct = i.product.toString() === productId.toString();
            const sameVariant = (variantId && i.variant) ? i.variant.toString() === variantId.toString() : (!variantId && (!i.variant || i.variant === null));
            return sameProduct && sameVariant;
        });

        const availableStock = variant ? variant.stock : product.stock;
        const currentQuantity = existingItem ? (existingItem.quantity || 0) : 0;
        if (availableStock !== undefined && currentQuantity + quantity > availableStock) {
            return res.status(400).json({ message: "No more can be added.", success: false });
        }

        if (existingItem) {
            existingItem.quantity = currentQuantity + quantity;
        } else {
            cart.items.push({
                product: product._id,
                variant: variant ? variant._id : undefined,
                quantity,
                price
            });
        }

        await cart.save();

        const cartDetails = await getCartDetails(user._id);

        res.status(200).json({ message: "Item added to cart", success: true, cart: cartDetails || { items: [], totalPrice: 0 } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", success: false });
    }
}

export async function getCart(req, res) {
    try {
        const user = req.user;
        const cart = await getCartDetails(user._id);
        return res.status(200).json({ message: "Cart fetched successfully", success: true, cart: cart || { items: [], totalPrice: 0 } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function incrementCartItemQuantity(req, res) {
    try {
        const { productId, variantId } = req.params;
        const user = req.user;

        const cart = await cartModel.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const item = cart.items.find(i => {
            const sameProduct = i.product.toString() === productId.toString();
            const sameVariant = (variantId && i.variant) ? i.variant.toString() === variantId.toString() : (!variantId && (!i.variant || i.variant === null));
            return sameProduct && sameVariant;
        });

        if (!item) return res.status(404).json({ message: "Item not found in cart", success: false });

        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found", success: false });

        const variant = variantId ? product.variants.id(variantId) : null;
        const availableStock = variant ? variant.stock : product.stock;
        const currentQuantity = item.quantity || 0;
        if (availableStock !== undefined && currentQuantity + 1 > availableStock) {
            return res.status(400).json({ message: "No more can be added.", success: false });
        }

        item.quantity = currentQuantity + 1;
        await cart.save();

        const cartDetails = await getCartDetails(user._id);
        return res.status(200).json({ message: "Item quantity incremented", success: true, cart: cartDetails || { items: [], totalPrice: 0 } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function decrementCartItemQuantity(req, res) {
    try {
        const { productId, variantId } = req.params;
        const user = req.user;

        const cart = await cartModel.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        const item = cart.items.find(i => {
            const sameProduct = i.product.toString() === productId.toString();
            const sameVariant = (variantId && i.variant) ? i.variant.toString() === variantId.toString() : (!variantId && (!i.variant || i.variant === null));
            return sameProduct && sameVariant;
        });

        if (!item) return res.status(404).json({ message: "Item not found in cart", success: false });

        item.quantity = Math.max(1, (item.quantity || 0) - 1);
        await cart.save();

        const cartDetails = await getCartDetails(user._id);
        return res.status(200).json({ message: "Item quantity decremented", success: true, cart: cartDetails || { items: [], totalPrice: 0 } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function removeCartItem(req, res) {
    try {
        const { productId, variantId } = req.params;
        const user = req.user;

        const cart = await cartModel.findOne({ user: user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

        cart.items = cart.items.filter(i => {
            const sameProduct = i.product.toString() === productId.toString();
            const sameVariant = (variantId && i.variant) ? i.variant.toString() === variantId.toString() : (!variantId && (!i.variant || i.variant === null));
            return !(sameProduct && sameVariant);
        });

        await cart.save();

        const cartDetails = await getCartDetails(user._id);
        return res.status(200).json({ message: "Item removed from cart", success: true, cart: cartDetails || { items: [], totalPrice: 0 } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function createOrderController(req, res) {
    try {
        const user = req.user;
        const cart = await getCartDetails(user._id);
        const { addressId } = req.body;

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty", success: false });
        }

        if (!user.addresses || !Array.isArray(user.addresses) || user.addresses.length === 0) {
            return res.status(400).json({ message: "No shipping addresses found. Please add an address first.", success: false });
        }

        const shippingAddress = user.addresses.find(addr => addr._id.toString() === addressId.toString());
        if (!shippingAddress) {
            return res.status(400).json({ message: "Invalid shipping address selected", success: false });
        }

        const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency || "INR" });

        const orderItems = cart.items.map(item => {
            // Find the specific variant to get correct price
            const variant = item.variant ? item.product.variants?.find(v => v._id.toString() === item.variant.toString()) : null;
            const itemPrice = variant?.price || item.product.price;
            
            return {
                title: item.product.title,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: item.product.images || [],
                description: item.product.description || "",
                price: itemPrice,
                seller: item.product.seller
            };
        });

        const payment = await paymentModel.create({
            price: { amount: cart.totalPrice, currency: cart.currency || "INR" },
            user: user._id,
            razorpay: { orderId: order.id || order["id"] || order.order_id || order.orderId },
            orderItems,
            shippingAddress,
            fromCart: true
        });

        return res.status(200).json({ message: "Order created", success: true, order, payment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function verifyOrderController(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatedSignature = crypto.createHmac('sha256', config.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature", success: false });
        }

        const payment = await paymentModel.findOne({ 'razorpay.orderId': razorpay_order_id });
        if (!payment) return res.status(404).json({ message: "Payment record not found", success: false });

        // Check if order already exists for this payment (duplicate prevention)
        const existingOrder = await orderModel.findOne({ payment: payment._id });
        if (existingOrder) {
            return res.status(200).json({ message: "Order already created", success: true, payment, order: existingOrder });
        }

        // Validate stock availability before creating order
        for (const item of payment.orderItems) {
            const product = await productModel.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product ${item.productId} not found`, success: false });
            }

            if (item.variantId) {
                let variantStock = null;
                
                // Check variants array
                const variant = product.variants.id(item.variantId);
                if (variant) {
                    variantStock = variant.stock;
                }
                
                // Check colors.sizes if not found in variants
                if (variantStock === null) {
                    for (const color of product.colors) {
                        const size = color.sizes.id(item.variantId);
                        if (size) {
                            variantStock = size.stock;
                            break;
                        }
                    }
                }

                if (variantStock === null || variantStock < (item.quantity || 1)) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for product: ${item.title}`, 
                        success: false 
                    });
                }
            } else {
                // Check base product stock
                if (product.stock !== undefined && product.stock < (item.quantity || 1)) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for product: ${item.title}`, 
                        success: false 
                    });
                }
            }
        }

        payment.status = "paid";
        payment.razorpay.paymentId = razorpay_payment_id;
        payment.razorpay.signature = razorpay_signature;

        await payment.save();

        const order = await orderModel.create({
            user: payment.user,
            payment: payment._id,
            price: payment.price,
            orderItems: payment.orderItems,
            shippingAddress: payment.shippingAddress,
            paymentStatus: payment.status,
            orderStatus: "Order Placed",
            razorpay: payment.razorpay
        });

        // Deduct inventory
        for (const item of payment.orderItems) {
            const product = await productModel.findById(item.productId);
            if (!product) continue;

            if (item.variantId) {
                let variantUpdated = false;
                
                // Try finding in variants array
                const variant = product.variants.id(item.variantId);
                if (variant) {
                    variant.stock = Math.max(0, variant.stock - (item.quantity || 1));
                    variantUpdated = true;
                }
                
                // Try finding in colors.sizes if not found in variants
                if (!variantUpdated) {
                    for (const color of product.colors) {
                        const size = color.sizes.id(item.variantId);
                        if (size) {
                            size.stock = Math.max(0, size.stock - (item.quantity || 1));
                            break;
                        }
                    }
                }
                
                await product.save();
            } else {
                // No variant selected - deduct from base product stock if it exists
                if (product.stock !== undefined) {
                    product.stock = Math.max(0, product.stock - (item.quantity || 1));
                    await product.save();
                }
            }
        }

        return res.status(200).json({ message: "Payment verified", success: true, payment, order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
