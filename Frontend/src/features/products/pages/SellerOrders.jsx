import React, { useEffect, useState } from 'react';
import { getSellerOrders, updateOrderStatus as updateStatusApi } from '../../cart/service/order.api';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getSellerOrders();
                if (res.success) {
                    setOrders(res.orders);
                } else {
                    setError("Failed to load orders.");
                }
            } catch (err) {
                console.error("Failed to fetch seller orders", err);
                setError("Failed to fetch seller orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await updateStatusApi(orderId, newStatus);
            if (res.success) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
            }
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status");
        }
    };

    const statusOptions = ["Order Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24 selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-20">
                    <div className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-medium" style={{ color: '#C9A96E' }}>
                            Seller Dashboard
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Orders Received
                        </h1>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>Loading Orders...</span>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center text-red-600">
                            {error}
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-8">
                            {orders.map(order => (
                                <div key={order._id} className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)]">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#e4e2df] pb-6 mb-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-1">Order #{order._id}</p>
                                            <p className="text-sm" style={{ color: '#1b1c1a' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-1">Total</p>
                                                <p className="text-lg font-medium" style={{ color: '#1b1c1a' }}>₹{order.sellerTotal?.toLocaleString()}</p>
                                            </div>
                                            <div className="w-px h-10 bg-[#e4e2df]"></div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-1">Status</p>
                                                <select 
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="text-sm border border-[#e4e2df] rounded-md px-2 py-1 outline-none focus:border-[#C9A96E]"
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Items</h3>
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="w-16 h-20 bg-[#f5f3f0] rounded overflow-hidden flex-shrink-0">
                                                        {item.images && item.images.length > 0 && (
                                                            <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium" style={{ color: '#1b1c1a' }}>{item.title}</h4>
                                                        <p className="text-[12px]" style={{ color: '#7A6E63' }}>Qty: {item.quantity}</p>
                                                        <p className="text-sm mt-1" style={{ color: '#1b1c1a' }}>₹{item.price?.amount?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Buyer Details</h3>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: '#1b1c1a' }}>
                                                    {order.shippingAddress?.fullName || 'N/A'}
                                                </p>
                                                <p className="text-[12px] mt-1" style={{ color: '#7A6E63' }}>
                                                    {order.user?.email}
                                                </p>
                                                <p className="text-[12px] mt-1" style={{ color: '#7A6E63' }}>
                                                    {order.shippingAddress?.phone}
                                                </p>
                                                <p className="text-[12px] mt-2 leading-relaxed" style={{ color: '#7A6E63' }}>
                                                    {order.shippingAddress?.line1}<br/>
                                                    {order.shippingAddress?.line2 && <>{order.shippingAddress?.line2}<br/></>}
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}<br/>
                                                    {order.shippingAddress?.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No orders yet.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                When customers purchase your pieces, their orders will appear here for you to fulfill.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SellerOrders;
