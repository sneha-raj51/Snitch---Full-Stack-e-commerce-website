import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getSellerDashboardStats, getSellerOrders } from '../../cart/service/order.api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    getSellerDashboardStats(),
                    getSellerOrders()
                ]);
                
                if (statsRes.success) {
                    setStats(statsRes.stats);
                }
                
                if (ordersRes.success) {
                    setRecentOrders(ordersRes.orders.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-20">
                    <div className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-medium" style={{ color: '#C9A96E' }}>
                            Seller Dashboard
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Overview
                        </h1>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>Loading Data...</span>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center text-red-600">
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-2">Total Revenue</p>
                                    <h3 className="text-3xl font-medium" style={{ color: '#1b1c1a' }}>
                                        ₹{stats?.totalRevenue?.toLocaleString() || 0}
                                    </h3>
                                </div>
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-2">Total Orders</p>
                                    <h3 className="text-3xl font-medium" style={{ color: '#1b1c1a' }}>
                                        {stats?.totalOrders || 0}
                                    </h3>
                                </div>
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-2">Active Listings</p>
                                    <h3 className="text-3xl font-medium" style={{ color: '#1b1c1a' }}>
                                        {stats?.activeListings || 0}
                                    </h3>
                                </div>
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-2">Pending Orders</p>
                                    <h3 className="text-3xl font-medium" style={{ color: '#1b1c1a' }}>
                                        {stats?.pendingOrders || 0}
                                    </h3>
                                </div>
                            </div>

                            {/* Recent Orders Section */}
                            <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.04)]">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Recent Orders</h2>
                                    <button 
                                        onClick={() => navigate('/seller/orders')}
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-[#C9A96E]" 
                                        style={{ color: '#7A6E63' }}
                                    >
                                        View All
                                    </button>
                                </div>

                                {recentOrders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#e4e2df]">
                                                    <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium">Order ID</th>
                                                    <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium">Date</th>
                                                    <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium">Items</th>
                                                    <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium">Total</th>
                                                    <th className="py-4 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentOrders.map(order => (
                                                    <tr key={order._id} className="border-b border-[#e4e2df] last:border-0 hover:bg-[#fbf9f6] transition-colors">
                                                        <td className="py-4 text-sm" style={{ color: '#1b1c1a' }}>#{order._id.substring(0, 8)}</td>
                                                        <td className="py-4 text-sm" style={{ color: '#7A6E63' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                        <td className="py-4 text-sm" style={{ color: '#1b1c1a' }}>{order.orderItems.length} items</td>
                                                        <td className="py-4 text-sm font-medium" style={{ color: '#1b1c1a' }}>₹{order.sellerTotal?.toLocaleString()}</td>
                                                        <td className="py-4 text-sm">
                                                            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.1em]" style={{ 
                                                                backgroundColor: order.orderStatus === 'Delivered' ? '#dcfce7' : '#fef9c3',
                                                                color: order.orderStatus === 'Delivered' ? '#166534' : '#854d0e'
                                                            }}>
                                                                {order.orderStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-sm" style={{ color: '#7A6E63' }}>No orders yet. Start selling to see your orders here.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;