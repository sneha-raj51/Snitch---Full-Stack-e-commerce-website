import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';
import { useWishlist } from '../hook/useWishlist';

const normalizeVariantAttributes = (attrs) => {
    if (!attrs) return {};
    if (attrs instanceof Map) return Object.fromEntries(attrs);
    if (typeof attrs === 'object') return attrs;
    try {
        return JSON.parse(attrs);
    } catch {
        return {};
    }
};

const normalizeColorName = (value) => (value ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [inWishlist, setInWishlist] = useState(false);
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();
    const { handleAddToWishlist, handleRemoveFromWishlist, handleGetWishlistStatus } = useWishlist();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            // Handle both cases depending on how API is structured
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (!product) return;

        const colorOptions = Array.isArray(product.colors) && product.colors.length > 0
            ? product.colors.map(color => color.name).filter(Boolean)
            : Array.from(new Set((product.variants || [])
                .map(v => normalizeVariantAttributes(v.attributes)?.color)
                .filter(Boolean)));

        if (colorOptions.length === 0) {
            setSelectedAttributes({});
            setSelectedColor('');
            setSelectedSize('');
            return;
        }

        setSelectedColor(prev => colorOptions.includes(prev) ? prev : colorOptions[0]);
    }, [product]);

    useEffect(() => {
        if (!selectedColor || !product) return;

        const colorGroup = Array.isArray(product.colors)
            ? product.colors.find(color => normalizeColorName(color.name) === normalizeColorName(selectedColor))
            : null;

        const sizes = colorGroup && Array.isArray(colorGroup.sizes)
            ? colorGroup.sizes.map(sizeEntry => sizeEntry.size).filter(Boolean)
            : Array.from(new Set((product.variants || [])
                .filter(v => normalizeColorName(normalizeVariantAttributes(v.attributes)?.color) === normalizeColorName(selectedColor))
                .map(v => normalizeVariantAttributes(v.attributes)?.size)
                .filter(Boolean)));

        setSelectedSize(prev => sizes.includes(prev) ? prev : (sizes[0] || ''));
    }, [selectedColor, product]);

    useEffect(() => {
        if (!selectedColor) return;
        setSelectedAttributes({
            color: selectedColor,
            ...(selectedSize ? { size: selectedSize } : {})
        });
    }, [selectedColor, selectedSize]);

    useEffect(() => {
        if (!product?._id) return;
        handleGetWishlistStatus(product._id)
            .then(status => setInWishlist(Boolean(status)))
            .catch(() => setInWishlist(false));
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product) return null;

        const exactVariant = (product.variants || []).find(v => {
            const attributes = normalizeVariantAttributes(v.attributes) || {};
            const matchesColor = !selectedColor || normalizeColorName(attributes.color) === normalizeColorName(selectedColor);
            const matchesSize = !selectedSize || normalizeColorName(attributes.size) === normalizeColorName(selectedSize);
            return matchesColor && matchesSize;
        });

        if (exactVariant) return exactVariant;

        const colorGroup = Array.isArray(product.colors)
            ? product.colors.find(color => normalizeColorName(color.name) === normalizeColorName(selectedColor || ''))
            : null;

        if (!colorGroup || !selectedSize) return null;

        const sizeEntry = (colorGroup.sizes || []).find(size => normalizeColorName(size.size) === normalizeColorName(selectedSize));
        if (!sizeEntry) return null;

        return {
            _id: `${colorGroup.name}-${selectedSize}`,
            description: colorGroup.description || product.description,
            stock: Number(sizeEntry.stock || 0),
            price: sizeEntry.price || product.price,
            images: colorGroup.images || [],
            attributes: {
                color: colorGroup.name,
                size: selectedSize
            }
        };
    }, [product, selectedColor, selectedSize]);

    const getColorSwatch = (color) => {
        const normalized = (color || '').toString().toLowerCase();
        const palette = {
            green: '#4e8f66',
            pink: '#d98aa7',
            red: '#b93b3b',
            blue: '#3d6db3',
            black: '#1f1f1f',
            white: '#f5f3f0',
            beige: '#d8c2a0',
            yellow: '#d6b845',
            orange: '#d57a3d',
            purple: '#7c5ea9',
            brown: '#825c3e',
            grey: '#7d7d7d',
            gray: '#7d7d7d'
        };

        return palette[normalized] || '#c7b7a0';
    };

    const availableColors = useMemo(() => {
        if (!product) return [];
        if (Array.isArray(product.colors) && product.colors.length > 0) {
            return Array.from(new Set(product.colors.map(color => color.name).filter(Boolean)));
        }
        if (!product?.variants) return [];
        return Array.from(new Set(product.variants
            .map(v => normalizeVariantAttributes(v.attributes)?.color)
            .filter(Boolean)));
    }, [product]);

    const availableSizes = useMemo(() => {
        if (!selectedColor || !product) return [];
        const colorGroup = Array.isArray(product.colors)
            ? product.colors.find(color => normalizeColorName(color.name) === normalizeColorName(selectedColor))
            : null;

        if (colorGroup && Array.isArray(colorGroup.sizes) && colorGroup.sizes.length > 0) {
            return Array.from(new Set(colorGroup.sizes.map(sizeEntry => sizeEntry.size).filter(Boolean)));
        }

        if (!product?.variants) return [];
        return Array.from(new Set(product.variants
            .filter(v => {
                const attrs = normalizeVariantAttributes(v.attributes) || {};
                return normalizeColorName(attrs.color) === normalizeColorName(selectedColor);
            })
            .map(v => normalizeVariantAttributes(v.attributes)?.size)
            .filter(Boolean)));
    }, [selectedColor, product]);

    const currentColorImages = useMemo(() => {
        if (!selectedColor || !product) return [];

        const selectedColorKey = normalizeColorName(selectedColor);

        const colorGroup = Array.isArray(product.colors)
            ? product.colors.find(color => normalizeColorName(color.name) === selectedColorKey)
            : null;

        const normalizeImageEntry = (image) => {
            if (!image) return null;
            if (typeof image === 'string') return { url: image };
            if (image.url) return { url: image.url };
            if (image.secure_url) return { url: image.secure_url };
            return null;
        };

        if (colorGroup && Array.isArray(colorGroup.images) && colorGroup.images.length > 0) {
            const matchedImages = colorGroup.images
                .map(normalizeImageEntry)
                .filter(Boolean);

            return Array.from(new Map(matchedImages.map(image => [image.url, image])).values());
        }

        const exactColorImages = (product.variants || [])
            .filter(v => normalizeColorName(normalizeVariantAttributes(v.attributes)?.color) === selectedColorKey)
            .flatMap(v => Array.isArray(v.images) ? v.images : [])
            .map(normalizeImageEntry)
            .filter(Boolean);

        return Array.from(new Map(exactColorImages.map(image => [image.url, image])).values());
    }, [product, selectedColor]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            const normalized = normalizeVariantAttributes(variant.attributes);
            Object.entries(normalized).forEach(([key, value]) => {
                if (!attrs[key]) attrs[key] = new Set();
                attrs[key].add(value);
            });
        });
        Object.keys(attrs).forEach(key => {
            attrs[key] = Array.from(attrs[key]);
        });
        return attrs;
    }, [product]);

    useEffect(() => {
        setSelectedImage(0);
    }, [activeVariant, selectedColor]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };

        const exactMatch = product.variants.find(v => {
            const vAttrs = normalizeVariantAttributes(v.attributes) || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });

        if (exactMatch) {
            setSelectedAttributes(normalizeVariantAttributes(exactMatch.attributes));
        } else {
            const fallbackVariant = product.variants.find(v => {
                const vAttrs = normalizeVariantAttributes(v.attributes) || {};
                return vAttrs[attrName] === value;
            });
            if (fallbackVariant) {
                setSelectedAttributes(normalizeVariantAttributes(fallbackVariant.attributes));
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    // Fallbacks: only use the default product gallery when no color is selected and no variant color images exist.
    const displayImages = selectedColor
        ? currentColorImages
        : (product.images && product.images.length > 0 ? product.images : [{ url: '/snitch_editorial_warm.png' }]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                        {/* ── LEFT: Image Gallery ── */}
                        <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

                            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: '#f5f3f0', '--tw-ring-offset-color': '#fbf9f6' }}
                                        >
                                            <img

                                                src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="relative w-full aspect-4/5 overflow-hidden group" style={{ backgroundColor: '#f5f3f0' }}>
                                {displayImages.length > 0 ? (
                                    <>
                                        <img
                                            src={displayImages[selectedImage]?.url || displayImages[0].url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-opacity duration-500"
                                        />
                                        {displayImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                                    className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                                    style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                                    aria-label="Previous image"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                                    className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                                    style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                                    aria-label="Next image"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center px-6 text-center text-[10px] uppercase tracking-[0.2em]" style={{ color: '#7A6E63' }}>
                                        No images for {selectedColor || 'this color'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span
                                    className="text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            {selectedColor || selectedSize ? (
                                <div className="mb-6 rounded-lg border border-[#e4e2df] bg-[#f8f6f3] px-4 py-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Selected variant
                                    </p>
                                    <p className="mt-2 text-sm" style={{ color: '#1b1c1a' }}>
                                        {selectedColor || 'Color not selected'}{selectedColor && selectedSize ? ' / ' : ''}{selectedSize || ''}
                                    </p>
                                </div>
                            ) : null}

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#e4e2df' }} />

                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        Color
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map(color => {
                                            const isSelected = selectedColor === color;
                                            const swatch = getColorSwatch(color);
                                            return (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                    style={isSelected ? {} : { backgroundColor: 'transparent' }}
                                                >
                                                    <span
                                                        className="inline-block rounded-full border border-white/60"
                                                        style={{ width: 12, height: 12, backgroundColor: swatch }}
                                                    />
                                                    {color}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        Size
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(size => {
                                            const variantForSize = product.variants.find(v => {
                                                const attrs = normalizeVariantAttributes(v.attributes) || {};
                                                return (attrs.color || '').toString().toLowerCase() === selectedColor.toString().toLowerCase()
                                                    && (attrs.size || '').toString().toLowerCase() === size.toString().toLowerCase();
                                            });
                                            const isSelected = selectedSize === size;
                                            const isOutOfStock = !variantForSize || Number(variantForSize.stock || 0) <= 0;

                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                                                    disabled={isOutOfStock}
                                                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : isOutOfStock ? 'border-[#e4e2df] text-[#b5ada3] bg-[#f5f3f0] cursor-not-allowed' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Stock Information */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-6">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                    {activeVariant?.description || product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-auto">
                                <button
                                    disabled={!activeVariant || Number(activeVariant.stock || 0) <= 0}
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                                    style={{
                                        backgroundColor: '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        if (activeVariant && Number(activeVariant.stock || 0) > 0) {
                                            e.currentTarget.style.backgroundColor = '#C9A96E';
                                            e.currentTarget.style.color = '#1b1c1a';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (activeVariant && Number(activeVariant.stock || 0) > 0) {
                                            e.currentTarget.style.backgroundColor = '#1b1c1a';
                                            e.currentTarget.style.color = '#fbf9f6';
                                        }
                                    }}
                                    onClick={() => {
                                        if (!activeVariant || Number(activeVariant.stock || 0) <= 0) return;
                                        handleAddItem({
                                            productId: product._id,
                                            variantId: activeVariant?._id
                                        })
                                    }}
                                >
                                    {activeVariant && Number(activeVariant.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>

                                <button
                                    type="button"
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border border-[#d0c5b5]"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onClick={async () => {
                                        try {
                                            if (inWishlist) {
                                                await handleRemoveFromWishlist(product._id)
                                                setInWishlist(false)
                                            } else {
                                                await handleAddToWishlist(product._id)
                                                setInWishlist(true)
                                            }
                                        } catch (error) {
                                            console.error('Wishlist update failed', error)
                                        }
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#d0c5b5';
                                    }}
                                >
                                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </button>

                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: '#d0c5b5',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#C9A96E';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#d0c5b5';
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra elegant details */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span>
                                    <span>Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span>
                                    <span>Within 14 days of delivery</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Authenticity</span>
                                    <span>100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;