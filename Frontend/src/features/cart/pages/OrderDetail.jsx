import React, { useEffect, useState } from 'react'
import { useOrder } from '../hook/useOrder'
import { useParams, Link } from 'react-router'

const OrderDetail = () => {
    const { orderId } = useParams()
    const { handleGetOrderById } = useOrder()
    const [order, setOrder] = useState(null)

    useEffect(() => {
        if (!orderId) return
        handleGetOrderById(orderId).then(setOrder).catch(console.error)
    }, [orderId])

    const formatCurrency = (amount, currency = 'INR') => `${currency} ${Number(amount).toLocaleString('en-IN')}`

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>
                <p className="text-sm uppercase tracking-[0.2em] text-[#7A6E63]">Loading order...</p>
            </div>
        )
    }

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
                            Order Details
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Order #{order._id}
                        </h1>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-8">
                            <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Items</h2>
                                <div className="mt-8 space-y-6">
                                    {order.orderItems.map(item => (
                                        <div key={`${item.productId}-${item.variantId}-${item.title}`} className="flex gap-4 rounded-3xl border border-[#e4e2df] p-5">
                                            <div className="w-24 h-28 flex-shrink-0 overflow-hidden rounded-3xl bg-[#f5f3f0]">
                                                <img src={item.images?.[0]?.url || '/snitch_editorial_warm.png'} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-[#1b1c1a]">{item.title}</p>
                                                <p className="mt-2 text-sm text-[#7A6E63]">Qty: {item.quantity}</p>
                                                <p className="mt-2 text-sm" style={{ color: '#1b1c1a' }}>{formatCurrency(item.price?.amount, item.price?.currency)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Shipping Address</h2>
                                <p className="mt-4 text-sm leading-relaxed text-[#4d463a]">
                                    {order.shippingAddress.fullName}<br />
                                    {order.shippingAddress.line1}<br />
                                    {order.shippingAddress.line2 ? `${order.shippingAddress.line2}<br />` : ''}
                                    {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                    {order.shippingAddress.country} - {order.shippingAddress.pinCode}<br />
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Status</p>
                                    <p className="mt-2 text-lg font-semibold" style={{ color: '#1b1c1a' }}>{order.orderStatus}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Order Date</p>
                                    <p className="mt-2 text-sm" style={{ color: '#1b1c1a' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Total</p>
                                    <p className="mt-2 text-lg font-semibold" style={{ color: '#1b1c1a' }}>{formatCurrency(order.price?.amount, order.price?.currency)}</p>
                                </div>
                                <Link to="/orders" className="inline-flex rounded-full border border-[#d0c5b5] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]">Back to Orders</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDetail
