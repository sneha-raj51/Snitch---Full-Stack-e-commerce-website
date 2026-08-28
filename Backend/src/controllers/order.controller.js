import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";

export async function getOrders(req, res) {
    try {
        const user = req.user;
        const orders = await orderModel.find({ user: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({ message: "Orders fetched successfully", success: true, orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const user = req.user;

        const order = await orderModel.findOne({ _id: orderId, user: user._id });
        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        return res.status(200).json({ message: "Order fetched successfully", success: true, order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function getSellerOrders(req, res) {
    try {
        const user = req.user;
        
        // Find orders containing items sold by this seller
        let orders = await orderModel.find({ "orderItems.seller": user._id })
            .populate('user', 'firstName lastName email contact')
            .sort({ createdAt: -1 });

        // Filter the orderItems to ONLY show the items sold by this seller
        // Also recalculate the order price to only reflect this seller's portion if needed
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.orderItems = orderObj.orderItems.filter(item => item.seller.toString() === user._id.toString());
            
            // Calculate total amount for this seller's items
            let sellerTotal = 0;
            orderObj.orderItems.forEach(item => {
                sellerTotal += (item.price?.amount || 0) * (item.quantity || 1);
            });
            orderObj.sellerTotal = sellerTotal;
            
            return orderObj;
        });

        return res.status(200).json({ message: "Seller orders fetched successfully", success: true, orders: filteredOrders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const user = req.user;

        // Verify the order has items belonging to this seller
        const order = await orderModel.findOne({ _id: orderId, "orderItems.seller": user._id });
        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized", success: false });
        }

        order.orderStatus = status;
        await order.save();

        return res.status(200).json({ message: "Order status updated", success: true, order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function getSellerDashboardStats(req, res) {
    try {
        const user = req.user;
        
        // 1. Get orders
        const orders = await orderModel.find({ "orderItems.seller": user._id });
        
        let totalRevenue = 0;
        let totalSales = 0;
        let pendingOrdersCount = 0;
        
        orders.forEach(order => {
            if (order.orderStatus === "Order Placed" || order.orderStatus === "Pending") {
                pendingOrdersCount++;
            }
            
            order.orderItems.forEach(item => {
                if (item.seller.toString() === user._id.toString()) {
                    totalRevenue += (item.price?.amount || 0) * (item.quantity || 1);
                    totalSales += (item.quantity || 1);
                }
            });
        });

        // 2. Get Products
        const products = await productModel.find({ seller: user._id });
        
        const activeListings = products.length; // Assuming all are active for now, or check a status field if exists
        let outOfStockCount = 0;
        
        products.forEach(product => {
            // Check base stock or variants stock
            let hasStock = false;
            
            if (product.variants && product.variants.length > 0) {
                hasStock = product.variants.some(v => v.stock > 0);
            } else if (product.colors && product.colors.length > 0) {
                hasStock = product.colors.some(c => c.sizes && c.sizes.some(s => s.stock > 0));
            } else {
                hasStock = (product.stock > 0);
            }
            
            if (!hasStock) outOfStockCount++;
        });

        return res.status(200).json({ 
            success: true, 
            stats: {
                totalRevenue,
                totalSales,
                totalOrders: orders.length,
                pendingOrders: pendingOrdersCount,
                activeListings,
                outOfStockCount
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}
