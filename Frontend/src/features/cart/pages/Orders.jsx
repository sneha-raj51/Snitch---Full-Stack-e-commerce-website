import React, { useEffect, useState } from 'react'
import { useOrder } from '../hook/useOrder'
import { Link } from 'react-router'

const Orders = () => {
    const { handleGetOrders } = useOrder()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        handleGetOrders().then(setOrders).catch(console.error)
    }, [])

    const formatCurrency = (amount, currency = 'INR') => `${currency} ${Number(amount).toLocaleString('en-IN')}`

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
                            My Orders
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Order History
                        </h1>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-8 pb-24">
                            {orders.map(order => (
                                <div key={order._id} className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Order #{order._id}</p>
                                            <h2 className="mt-2 text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                                {order.orderItems?.[0]?.title || 'Order details'}
                                            </h2>
                                            <p className="text-sm text-[#7A6E63] mt-2">{order.orderItems?.length || 0} item{order.orderItems?.length === 1 ? '' : 's'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">Ordered on</p>
                                            <p className="mt-2 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#1b1c1a' }}>{order.orderStatus}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">Total</p>
                                            <p className="mt-2 text-sm font-medium" style={{ color: '#1b1c1a' }}>{formatCurrency(order.price?.amount, order.price?.currency)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">Shipping</p>
                                            <p className="mt-2 text-sm" style={{ color: '#1b1c1a' }}>{order.shippingAddress?.addressType || 'N/A'}</p>
                                        </div>
                                        <div className="text-right sm:text-left">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="inline-flex rounded-full border border-[#d0c5b5] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mb-6 text-[80px] leading-none" style={{ color: '#C9A96E' }}>
                                ✧
                            </div>
                            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                No orders yet
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed mb-8" style={{ color: '#7A6E63' }}>
                                Place a purchase and it will appear here in your order history.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex rounded-full border border-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors hover:bg-[#1b1c1a] hover:text-white"
                                style={{ color: '#1b1c1a' }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Orders
