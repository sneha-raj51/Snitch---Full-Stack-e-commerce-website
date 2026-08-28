import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const MyListings = () => {
    const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();

    const onDelete = async (e, productId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await handleDeleteProduct(productId);
                handleGetSellerProduct();
            } catch (err) {
                console.error("Failed to delete product", err);
                alert("Failed to delete product");
            }
        }
    };

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24">



                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                        <div>
                            <h1
                                className="text-4xl lg:text-5xl font-light leading-tight"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                My Listings
                            </h1>
                            {/* Gold rule separator */}
                            <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                        </div>

                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 w-full md:w-auto text-center"
                            style={{
                                backgroundColor: '#1b1c1a',
                                color: '#fbf9f6',
                                fontFamily: "'Inter', sans-serif"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#C9A96E';
                                e.currentTarget.style.color = '#1b1c1a';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#1b1c1a';
                                e.currentTarget.style.color = '#fbf9f6';
                            }}
                        >
                            New Listing
                        </button>
                    </div>

                    {/* ── Product Grid ── */}
                    {sellerProducts && sellerProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 pb-24">
                            {sellerProducts.map(product => {
                                const firstColorWithImages = Array.isArray(product?.colors)
                                    ? product.colors.find(color => Array.isArray(color.images) && color.images.length > 0)
                                    : null;
                                const firstColorImage = firstColorWithImages?.images?.[0];

                                const firstVariantWithImages = Array.isArray(product?.variants)
                                    ? product.variants.find(variant => Array.isArray(variant.images) && variant.images.length > 0)
                                    : null;
                                const firstVariantImage = firstVariantWithImages?.images?.[0];

                                const fallbackProductImage = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : null;

                                const imageUrl = (firstColorImage?.url || firstColorImage?.secure_url || (typeof firstColorImage === 'string' ? firstColorImage : null))
                                    || (firstVariantImage?.url || firstVariantImage?.secure_url || (typeof firstVariantImage === 'string' ? firstVariantImage : null))
                                    || (fallbackProductImage?.url || fallbackProductImage?.secure_url || (typeof fallbackProductImage === 'string' ? fallbackProductImage : null))
                                    || '/snitch_editorial_warm.png';

                                return (
                                    <div
                                        onClick={() => { navigate(`/seller/product/${product._id}`) }}
                                        key={product._id} className="group cursor-pointer flex flex-col">
                                        {/* Image Container */}
                                        <div className="aspect-[4/5] overflow-hidden mb-6" style={{ backgroundColor: '#f5f3f0' }}>
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <h3
                                                    className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#C9A96E]"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                                >
                                                    {product.title}
                                                </h3>
                                            </div>

                                            <p
                                                className="text-[12px] line-clamp-2 leading-relaxed"
                                                style={{ color: '#7A6E63' }}
                                            >
                                                {product.description}
                                            </p>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span
                                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                                    style={{ color: '#1b1c1a' }}
                                                >
                                                    {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                                </span>
                                                <button 
                                                    onClick={(e) => onDelete(e, product._id)}
                                                    className="text-[10px] uppercase tracking-[0.2em] text-[#ba1a1a] hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-24 text-center flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4" style={{ color: '#C9A96E' }}>Empty Listings</span>
                            <p className="max-w-md mx-auto text-lg leading-relaxed mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#7A6E63' }}>
                                No listings yet. Start selling by adding your first product.
                            </p>
                            <button
                                onClick={() => navigate('/seller/create-product')}
                                className="py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300"
                                style={{
                                    backgroundColor: '#1b1c1a',
                                    color: '#fbf9f6',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#C9A96E';
                                    e.currentTarget.style.color = '#1b1c1a';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#1b1c1a';
                                    e.currentTarget.style.color = '#fbf9f6';
                                }}
                            >
                                + Add New Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyListings;
