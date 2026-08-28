import React, { useEffect, useState } from 'react';
import { getSellerDashboardStats } from '../../cart/service/order.api';

const SellerEarnings = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getSellerDashboardStats();
                if (res.success) {
                    setStats(res.stats);
                } else {
                    setError("Failed to load earnings.");
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
                setError("Failed to fetch earnings data");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const hasSales = stats && stats.totalSales > 0;

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
                            Earnings & Sales
                        </h1>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#C9A96E' }}>Loading Earnings...</span>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center text-red-600">
                            {error}
                        </div>
                    ) : hasSales ? (
                        <div className="space-y-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-10 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center flex flex-col justify-center min-h-[200px]">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-4">Total Revenue</p>
                                    <h3 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                        ₹{stats.totalRevenue?.toLocaleString()}
                                    </h3>
                                </div>
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-10 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center flex flex-col justify-center min-h-[200px]">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-4">Completed Sales</p>
                                    <h3 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                        {stats.totalSales} <span className="text-xl">items</span>
                                    </h3>
                                </div>
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-10 shadow-[0_18px_50px_rgba(27,28,26,0.04)] text-center flex flex-col justify-center min-h-[200px]">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-4">Average Order Value</p>
                                    <h3 className="text-4xl lg:text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                        ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No earnings to report yet.
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                Your sales volume, revenue, and pending payouts will be summarized here once your pieces start selling.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SellerEarnings;
