import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '')
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { handleLogout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const displayName = user?.fullname?.split(' ')[0] || 'Account'
    const avatarLetter = user?.fullname?.trim()?.charAt(0)?.toUpperCase() || 'A'

    useEffect(() => {
        setSearchValue(searchParams.get('q') ?? '')
    }, [searchParams])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearchChange = (value) => {
        setSearchValue(value)
        const params = new URLSearchParams(searchParams)
        const trimmedValue = value.trim()

        if (trimmedValue) {
            params.set('q', trimmedValue)
        } else {
            params.delete('q')
        }

        if (location.pathname === '/') {
            setSearchParams(params)
        } else {
            navigate({ pathname: '/', search: params.toString() }, { replace: true })
        }
    }

    const handleLogoutClick = async () => {
        await handleLogout()
        setMenuOpen(false)
        navigate('/login')
    }

    return (
        <nav className="px-8 lg:px-16 xl:px-24 pt-8 pb-6 border-b" style={{ borderColor: '#e4e2df' }}>
            <div className="flex justify-center">
                <Link
                    to="/"
                    className="text-3xl md:text-4xl font-semibold tracking-[0.45em] uppercase hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                >
                    SNITCH
                </Link>
            </div>

            <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                    <span className="text-lg leading-none">←</span>
                    <Link to="/" className="transition-colors hover:text-[#C9A96E]">Home</Link>
                </div>

                <div className="relative w-full min-w-[220px] lg:max-w-xl">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6E63]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        placeholder="Search products…"
                        className="w-full rounded-full border border-[#e4e2df] bg-white py-3 pl-11 pr-4 text-sm text-[#1b1c1a] placeholder:text-[#7A6E63] focus:border-[#C9A96E] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/20"
                    />
                </div>

                <div className="flex items-center justify-end gap-5 text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                    {user ? (
                        <>
                            <Link
                                to="/cart"
                                className="relative flex items-center hover:opacity-70 transition-opacity"
                                style={{ color: '#1b1c1a' }}
                                aria-label="Shopping cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {cartItems?.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor: '#C9A96E',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '9px',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        {cartItems.length > 9 ? '9+' : cartItems.length}
                                    </span>
                                )}
                            </Link>
                            <div ref={menuRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(prev => !prev)}
                                    className="flex items-center gap-2 rounded-full border border-[#e4e2df] bg-white px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1b1c1a] transition-shadow hover:shadow-sm"
                                >
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e4e2df] text-[11px] font-semibold text-[#1b1c1a]">
                                        {avatarLetter}
                                    </span>
                                    <span>{displayName}</span>
                                    <span className="text-[11px]">▾</span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 z-20 mt-3 w-64 min-w-[220px] overflow-hidden rounded-2xl border border-[#e4e2df] bg-white text-left shadow-[0_18px_50px_rgba(27,28,26,0.08)]">
                                        <div className="px-5 py-4 border-b border-[#e4e2df]">
                                            <p className="text-sm font-semibold text-[#1b1c1a]">{displayName}</p>
                                            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">{user?.role === "seller" ? "Seller Account" : "Buyer Account"}</p>
                                        </div>
                                        {user?.role === "seller" ? (
                                            <div className="space-y-1 p-3">
                                                <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Seller Dashboard</Link>
                                                <Link to="/seller/listings" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">My Listings</Link>
                                                <Link to="/seller/create-product" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Add New Listing</Link>
                                                <Link to="/seller/orders" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Orders Received</Link>
                                                <Link to="/seller/earnings" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Earnings/Sales</Link>
                                                <Link to="/seller/profile" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Store Profile</Link>
                                                <Link to="/seller/settings" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Settings</Link>
                                                <Link to="/seller/help" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Help & Support</Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-1 p-3">
                                                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">My Profile</Link>
                                                <Link to="/orders" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">My Orders</Link>
                                                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Wishlist</Link>
                                                <Link to="/addresses" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Saved Addresses</Link>
                                                <Link to="/help" onClick={() => setMenuOpen(false)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-[#1b1c1a] transition-colors hover:bg-[#fbf9f6]">Help & Support</Link>
                                            </div>
                                        )}
                                        <div className="border-t border-[#e4e2df] p-3">
                                            <button
                                                type="button"
                                                onClick={handleLogoutClick}
                                                className="w-full rounded-xl bg-[#1b1c1a] px-4 py-3 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3f3f3f]"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                            <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Nav