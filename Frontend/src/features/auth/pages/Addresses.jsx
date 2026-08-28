import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAddress } from '../hook/useAddress'

const defaultForm = {
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    country: 'India',
    state: '',
    city: '',
    pinCode: '',
    addressType: 'Home'
}

const Addresses = () => {
    const user = useSelector(state => state.auth.user)
    const { handleGetAddresses, handleAddAddress, handleUpdateAddress, handleDeleteAddress } = useAddress()
    const [addresses, setAddresses] = useState(user?.addresses || [])
    const [editingAddressId, setEditingAddressId] = useState(null)
    const [form, setForm] = useState(defaultForm)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        handleGetAddresses().then(setAddresses).catch(console.error)
    }, [])

    useEffect(() => {
        setAddresses(user?.addresses || [])
    }, [user])

    const selectedAddress = useMemo(() => addresses.find(addr => addr._id === editingAddressId), [addresses, editingAddressId])

    useEffect(() => {
        if (!selectedAddress) {
            setForm(defaultForm)
            return
        }
        setForm({
            fullName: selectedAddress.fullName || '',
            phone: selectedAddress.phone || '',
            line1: selectedAddress.line1 || '',
            line2: selectedAddress.line2 || '',
            country: selectedAddress.country || 'India',
            state: selectedAddress.state || '',
            city: selectedAddress.city || '',
            pinCode: selectedAddress.pinCode || '',
            addressType: selectedAddress.addressType || 'Home'
        })
    }, [selectedAddress])

    const handleInput = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

    const validate = () => {
        if (!form.fullName || !form.phone || !form.line1 || !form.country || !form.state || !form.city || !form.pinCode) {
            setError('Please fill all required fields.')
            return false
        }
        if (!/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number.')
            return false
        }
        if (!/^\d{5,6}$/.test(form.pinCode)) {
            setError('Please enter a valid PIN code.')
            return false
        }
        return true
    }

    const handleSave = async () => {
        setError(null)
        setMessage(null)

        if (!validate()) return

        try {
            if (editingAddressId) {
                await handleUpdateAddress(editingAddressId, form)
                setMessage('Address updated successfully')
            } else {
                await handleAddAddress(form)
                setMessage('Address added successfully')
            }
            setEditingAddressId(null)
        } catch (err) {
            setError('Unable to save address')
        }
    }

    const handleRemove = async addressId => {
        const confirmed = window.confirm('Are you sure you want to remove this address?')
        if (!confirmed) return

        try {
            await handleDeleteAddress(addressId)
            setMessage('Address removed successfully')
        } catch (err) {
            setError('Unable to remove address')
        }
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
                            Saved Addresses
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Manage Shipping Addresses
                        </h1>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-[#e4e2df] bg-white p-6 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E]">Address Book</p>
                                    <p className="mt-2 text-sm text-[#7A6E63]">Your saved shipping addresses are private and only visible to you.</p>
                                </div>
                                <button
                                    onClick={() => setEditingAddressId(null)}
                                    className="rounded-full border border-[#d0c5b5] bg-white px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                >
                                    Add New Address
                                </button>
                            </div>

                            {addresses.length > 0 ? (
                                <div className="grid gap-6">
                                    {addresses.map(address => (
                                        <div key={address._id} className="rounded-[2rem] border border-[#e4e2df] bg-white p-6 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold" style={{ color: '#1b1c1a' }}>{address.fullName}</p>
                                                    <p className="text-sm text-[#7A6E63] mt-1">{address.phone}</p>
                                                    <p className="mt-3 text-sm leading-relaxed" style={{ color: '#4d463a' }}>
                                                        {address.line1}<br />
                                                        {address.line2 ? `${address.line2}<br />` : ''}
                                                        {address.city}, {address.state}<br />
                                                        {address.country} - {address.pinCode}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setEditingAddressId(address._id)}
                                                        className="rounded-full border border-[#d0c5b5] bg-white px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(address._id)}
                                                        className="rounded-full border border-[#e4e2df] bg-[#f5f3f0] px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:bg-[#e4e2df]"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-12 text-center text-[#7A6E63] shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                                    You have no saved addresses yet.
                                </div>
                            )}
                        </div>

                        <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">{editingAddressId ? 'Edit Address' : 'Add New Address'}</p>
                            <h2 className="mt-4 text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                {editingAddressId ? 'Update Details' : 'New Address'}
                            </h2>

                            <div className="mt-8 space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Full Name</label>
                                    <input value={form.fullName} onChange={e => handleInput('fullName', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Phone Number</label>
                                    <input value={form.phone} onChange={e => handleInput('phone', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Address Line 1</label>
                                    <input value={form.line1} onChange={e => handleInput('line1', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Address Line 2</label>
                                    <input value={form.line2} onChange={e => handleInput('line2', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Country</label>
                                        <input value={form.country} onChange={e => handleInput('country', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">State</label>
                                        <input value={form.state} onChange={e => handleInput('state', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">City</label>
                                        <input value={form.city} onChange={e => handleInput('city', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">PIN Code</label>
                                        <input value={form.pinCode} onChange={e => handleInput('pinCode', e.target.value)} className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Address Type</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {['Home', 'Work', 'Other'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handleInput('addressType', type)}
                                                className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${form.addressType === type ? 'bg-[#1b1c1a] text-white' : 'border border-[#e4e2df] bg-white text-[#1b1c1a]'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {message && <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
                                {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        onClick={handleSave}
                                        className="rounded-full bg-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-white transition-colors hover:bg-[#3f3f3f]"
                                    >
                                        Save Address
                                    </button>
                                    <button
                                        onClick={() => setEditingAddressId(null)}
                                        className="rounded-full border border-[#e4e2df] bg-white px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Addresses
