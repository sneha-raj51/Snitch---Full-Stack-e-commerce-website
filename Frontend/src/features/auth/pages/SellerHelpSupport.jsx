import React, { useState } from 'react'

const faqs = [
    { question: 'How do I add a new listing?', answer: 'Click on "Add New Listing" from your profile dropdown. Fill in the product details, attributes, variants (size/color), and upload high-quality images. Once saved, it will be instantly visible to buyers.' },
    { question: 'When do I get paid for my sales?', answer: 'Payments are processed after an order is marked as "Delivered" and the 14-day return window has closed. Payouts are transferred weekly to your registered bank account.' },
    { question: 'How do I handle returns?', answer: 'If a buyer requests a return, you will see it in your Orders tab. You must approve or reject the return based on your store policies. Snitch handles the logistics once approved.' },
    { question: 'Who handles shipping?', answer: 'Snitch provides integrated shipping partners. Once you mark an order as "Ready to Ship", our delivery partner will pick it up from your registered warehouse address.' }
]

const SellerHelpSupport = () => {
    const [activeIndex, setActiveIndex] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', issue: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const toggleItem = index => setActiveIndex(activeIndex === index ? null : index)

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
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
                            Seller Dashboard
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Seller Support
                        </h1>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-8">
                            <section className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Seller FAQ</h2>
                                {faqs.map((faq, index) => (
                                    <div key={faq.question} className="rounded-3xl border border-[#e4e2df] overflow-hidden mb-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 text-left text-sm font-medium transition-colors hover:bg-[#fbf9f6]"
                                            style={{ color: '#1b1c1a' }}
                                        >
                                            {faq.question}
                                        </button>
                                        {activeIndex === index && (
                                            <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>

                            <section className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Support Categories</h2>
                                {['Order & Fulfillment Support', 'Payment & Payout Support', 'Product & Listing Support', 'Account Settings'].map(item => (
                                    <div key={item} className="rounded-3xl border border-[#e4e2df] p-5 mb-4 hover:border-[#C9A96E] transition-colors cursor-pointer">
                                        <h3 className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: '#1b1c1a' }}>{item}</h3>
                                        <p className="mt-2 text-sm text-[#7A6E63]">Get specialized help for {item.toLowerCase()}.</p>
                                    </div>
                                ))}
                            </section>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Contact Us</h2>
                                <p className="text-sm leading-relaxed text-[#7A6E63] mb-6">
                                    Our Seller Support team is available to help you grow your business.
                                </p>
                                
                                <div className="space-y-4 mb-8">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] mb-1">Email</p>
                                        <p className="text-sm font-medium" style={{ color: '#1b1c1a' }}>sellersupport@snitch.com</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] mb-1">Phone</p>
                                        <p className="text-sm font-medium" style={{ color: '#1b1c1a' }}>+91 80000 12345</p>
                                        <p className="text-xs mt-1" style={{ color: '#7A6E63' }}>(Demo Support Number)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] mb-1">Availability</p>
                                        <p className="text-sm font-medium" style={{ color: '#1b1c1a' }}>Monday – Saturday</p>
                                        <p className="text-sm" style={{ color: '#1b1c1a' }}>10:00 AM – 7:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Store Name / Your Name" className="w-full rounded-2xl border border-[#e4e2df] bg-[#fbf9f6] px-4 py-3 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#C9A96E]" />
                                    <input value={form.issue} onChange={e => handleChange('issue', e.target.value)} placeholder="Order ID or Subject" className="w-full rounded-2xl border border-[#e4e2df] bg-[#fbf9f6] px-4 py-3 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#C9A96E]" />
                                    <textarea value={form.message} onChange={e => handleChange('message', e.target.value)} placeholder="How can we help?" rows="4" className="w-full rounded-2xl border border-[#e4e2df] bg-[#fbf9f6] px-4 py-3 text-sm text-[#1b1c1a] focus:outline-none focus:border-[#C9A96E]" />
                                    <button type="submit" className="w-full rounded-full bg-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-white transition-colors hover:bg-[#C9A96E]">Submit Ticket</button>
                                    {submitted && <p className="text-sm text-[#4f7d2e] mt-2">Support ticket created successfully. We'll email you shortly.</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SellerHelpSupport
