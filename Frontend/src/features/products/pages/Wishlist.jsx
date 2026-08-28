import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useWishlist } from '../hook/useWishlist'
import { useNavigate, Link } from 'react-router'
import { useCart } from '../../cart/hook/useCart'

const Wishlist = () => {
    const wishlist = useSelector(state => state.wishlist.items)
    const { handleGetWishlist, handleRemoveFromWishlist } = useWishlist()
    const { handleAddItem, handleGetCart } = useCart()
    const navigate = useNavigate()

    useEffect(() => {
        handleGetWishlist()
    }, [handleGetWishlist])

    const handleMoveToCart = async (productId, variantId) => {
        await handleAddItem({ productId, variantId })
        await handleGetCart()
        navigate('/cart')
    }

    const handleRemove = async (productId) => {
        await handleRemoveFromWishlist(productId)
        await handleGetWishlist()
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
                            Wishlist
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Saved pieces
                        </h1>
                    </div>

                    {wishlist && wishlist.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
                            {wishlist.map(item => {
                                const product = item.product
                                const imageUrl = product?.images?.[0]?.url || '/snitch_editorial_warm.png'
                                return (
                                    <div key={item._id} className="bg-white p-6 rounded-3xl shadow-[0_18px_50px_rgba(27,28,26,0.06)] transition-all hover:-translate-y-1">
                                        <div className="cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                                            <div className="aspect-[4/5] overflow-hidden mb-6" style={{ backgroundColor: '#f5f3f0' }}>
                                                <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <h2 className="text-xl leading-snug mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                                {product.title}
                                            </h2>
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#1b1c1a' }}>
                                                {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleMoveToCart(product._id, product.variants?.[0]?._id)}
                                                className="w-full rounded-full border border-[#e4e2df] bg-white py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(product._id)}
                                                className="w-full rounded-full bg-[#1b1c1a] py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-white transition-colors hover:bg-[#3f3f3f]"
                                            >
                                                Remove from Wishlist
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="mb-6 text-[80px] leading-none" style={{ color: '#C9A96E' }}>
                                ♡
                            </div>
                            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                                Your Wishlist is Empty
                            </h2>
                            <p className="max-w-md mx-auto text-sm leading-relaxed mb-8" style={{ color: '#7A6E63' }}>
                                Save your favorite pieces and come back to them later.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex rounded-full border border-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors hover:bg-[#1b1c1a] hover:text-white"
                                style={{ color: '#1b1c1a' }}
                            >
                                Explore Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Wishlist
