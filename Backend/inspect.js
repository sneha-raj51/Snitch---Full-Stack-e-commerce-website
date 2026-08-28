import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";
import Product from "./src/models/product.model.js";
import Order from "./src/models/order.model.js";
import Payment from "./src/models/payment.model.js";

dotenv.config();

async function inspectData() {
    await connectDB();
    console.log("===============================");
    console.log("INSPECTING DATA");
    console.log("===============================");

    const users = await User.find({});
    const buyers = users.filter(u => u.role === "buyer");
    const sellers = users.filter(u => u.role === "seller");
    
    console.log(`Total Users: ${users.length} (Buyers: ${buyers.length}, Sellers: ${sellers.length})`);
    
    const products = await Product.find({});
    console.log(`Total Products: ${products.length}`);
    
    const orders = await Order.find({});
    console.log(`Total Orders: ${orders.length}`);

    const payments = await Payment.find({});
    console.log(`Total Payments: ${payments.length}`);

    console.log("===============================");
    console.log("SELLER ORDER LOGIC");
    console.log("===============================");
    
    if (sellers.length > 0) {
        for (const seller of sellers) {
            console.log(`\nSeller: ${seller.fullname} (${seller._id})`);
            // Find products for this seller
            const sellerProducts = products.filter(p => p.seller.toString() === seller._id.toString());
            console.log(`  Products count: ${sellerProducts.length}`);
            
            // Find orders containing this seller's products
            const sellerProductIds = sellerProducts.map(p => p._id.toString());
            
            let relevantOrders = 0;
            orders.forEach(order => {
                const hasSellerProduct = order.orderItems.some(item => item.productId && sellerProductIds.includes(item.productId.toString()));
                if (hasSellerProduct) {
                    relevantOrders++;
                }
            });
            console.log(`  Relevant orders count: ${relevantOrders}`);
        }
    }

    process.exit(0);
}

inspectData().catch(err => {
    console.error(err);
    process.exit(1);
});
