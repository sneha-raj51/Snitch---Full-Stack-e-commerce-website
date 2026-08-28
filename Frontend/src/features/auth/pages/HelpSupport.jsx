import React, { useState } from 'react'

const faqs = [
    { question: 'How can I cancel an order?', answer: 'Orders can be canceled if they have not yet shipped. Please visit My Orders and contact support for assistance.' },
    { question: 'How long does delivery take?', answer: 'Delivery timelines depend on the destination. Most orders arrive within 7-12 business days.' },
    { question: 'How can I return a product?', answer: 'Returns are accepted within 14 days of delivery. Please contact support to initiate a return.' },
    { question: 'How can I contact support?', answer: 'Use the contact support form below or send an email to support@snitch.com.' }
]

const HelpSupport = () => {
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
                            Help & Support
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            How can we help you?
                        </h1>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-8">
                            <section className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Quick Links</h2>
                                {['Order Help', 'Shipping & Delivery', 'Returns & Refunds', 'Contact Support', 'Report an Issue'].map(item => (
                                    <div key={item} className="rounded-3xl border border-[#e4e2df] p-5 mb-4 hover:border-[#C9A96E] transition-colors">
                                        <h3 className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: '#1b1c1a' }}>{item}</h3>
                                        <p className="mt-3 text-sm text-[#7A6E63]">Helpful information about {item.toLowerCase()}.</p>
                                    </div>
                                ))}
                            </section>

                            <section className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>FAQ</h2>
                                {faqs.map((faq, index) => (
                                    <div key={faq.question} className="rounded-3xl border border-[#e4e2df] overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 text-left text-sm font-medium"
                                            style={{ color: '#1b1c1a' }}
                                        >
                                            {faq.question}
                                        </button>
                                        {activeIndex === index && (
                                            <div className="px-6 pb-5 text-sm text-[#7A6E63]">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        </div>

                        <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                            <h2 className="text-2xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Contact Support</h2>
                            <p className="text-sm text-[#7A6E63] mb-6">If you need help, send us your issue and we'll get back to you.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Name" className="w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                <input value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="Email" className="w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                <input value={form.issue} onChange={e => handleChange('issue', e.target.value)} placeholder="Issue" className="w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                <textarea value={form.message} onChange={e => handleChange('message', e.target.value)} placeholder="Message" rows="5" className="w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                <button type="submit" className="w-full rounded-full bg-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-white transition-colors hover:bg-[#3f3f3f]">Submit Request</button>
                                {submitted && <p className="text-sm text-[#4f7d2e]">Your request has been recorded locally. Our support team will get back to you if available.</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HelpSupport
