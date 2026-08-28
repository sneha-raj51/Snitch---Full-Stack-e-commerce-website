import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [colorGroups, setColorGroups] = useState([
        { id: 1, name: '', description: '', priceAmount: '', priceCurrency: 'INR', images: [], sizes: [{ size: '', stock: 0 }] }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addColorGroup = () => {
        setColorGroups(prev => [
            ...prev,
            { id: Date.now() + Math.random(), name: '', description: '', priceAmount: '', priceCurrency: 'INR', images: [], sizes: [{ size: '', stock: 0 }] }
        ]);
    };

    const updateColorGroup = (groupId, field, value) => {
        setColorGroups(prev => prev.map(group => group.id === groupId ? { ...group, [field]: value } : group));
    };

    const addSizeRow = (groupId) => {
        setColorGroups(prev => prev.map(group => group.id === groupId ? { ...group, sizes: [...group.sizes, { size: '', stock: 0 }] } : group));
    };

    const updateSizeRow = (groupId, sizeIndex, field, value) => {
        setColorGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            return {
                ...group,
                sizes: group.sizes.map((row, idx) => idx === sizeIndex ? { ...row, [field]: field === 'stock' ? Number(value || 0) : value } : row)
            };
        }));
    };

    const removeSizeRow = (groupId, sizeIndex) => {
        setColorGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            const nextSizes = group.sizes.filter((_, idx) => idx !== sizeIndex);
            return { ...group, sizes: nextSizes.length ? nextSizes : [{ size: '', stock: 0 }] };
        }));
    };

    const removeColorGroup = (groupId) => {
        setColorGroups(prev => prev.length > 1 ? prev.filter(group => group.id !== groupId) : prev);
    };

    const addGroupFiles = (groupId, files) => {
        const fileList = Array.from(files || []);
        setColorGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            const remainingSlots = 7 - group.images.length;
            const toAdd = fileList.slice(0, remainingSlots);
            const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
            return { ...group, images: [...group.images, ...newImages] };
        }));
    };

    const removeGroupImage = (groupId, index) => {
        setColorGroups(prev => prev.map(group => {
            if (group.id !== groupId) return group;
            const updated = [...group.images];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return { ...group, images: updated };
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);

            const colorPayload = [];

            colorGroups.forEach(group => {
                const validSizes = (group.sizes || []).filter(sizeRow => sizeRow.size && sizeRow.size.trim());
                if (!group.name || !group.name.trim() || validSizes.length === 0) return;

                const colorEntry = {
                    name: group.name.trim(),
                    description: group.description || '',
                    imageCount: group.images.length,
                    sizes: validSizes.map(sizeRow => ({
                        size: sizeRow.size.trim(),
                        stock: Number(sizeRow.stock || 0),
                        price: {
                            amount: Number(group.priceAmount || formData.priceAmount || 0),
                            currency: group.priceCurrency || formData.priceCurrency || 'INR'
                        }
                    }))
                };

                colorPayload.push(colorEntry);
                group.images.forEach(image => data.append('variantImages', image.file));
            });

            if (colorPayload.length > 0) {
                data.append('colors', JSON.stringify(colorPayload));
            }

            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]";
    const inputStyle = { color: '#1b1c1a', borderBottom: '1px solid #d0c5b5', fontFamily: "'Inter', sans-serif" };
    const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur = (e) => { e.target.style.borderBottomColor = '#d0c5b5'; };

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
                <div className="max-w-6xl mx-auto px-8 lg:px-16 xl:px-24">

                    {/* ── Top Bar ── */}
                    <div className="pt-10 pb-0 flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none"
                            style={{ color: '#B5ADA3' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            Snitch.
                        </span>
                    </div>

                    {/* ── Page Header ── */}
                    <div className="pt-10 pb-0">
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            New Listing
                        </h1>
                        {/* Gold rule separator */}
                        <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="pt-14 pb-24">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-12">
                                {/* Product Title */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="cp-title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="cp-description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent outline-none py-4 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#d0c5b5]"
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Price
                                    </label>
                                    <div className="flex gap-5 items-end">
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 flex-[3]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Amount</span>
                                            <input
                                                id="cp-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={inputClass}
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Currency</span>
                                            <select
                                                id="cp-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none py-4 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: '#fbf9f6', color: '#1b1c1a' }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Variant builder */}
                            <div className="rounded-xl border border-[#e4e2df] p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[10px] uppercase tracking-[0.22em] font-medium" style={{ color: '#7A6E63' }}>
                                    Color variants
                                </h3>
                                <button
                                    type="button"
                                    onClick={addColorGroup}
                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#C9A96E' }}
                                >
                                    + add color
                                </button>
                            </div>

                            <div className="space-y-6">
                                {colorGroups.map((group, groupIndex) => (
                                    <div key={group.id} className="rounded-xl border border-[#e4e2df] bg-[#fbf9f6] p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3 w-full">
                                                <input
                                                    type="text"
                                                    placeholder="Color name"
                                                    value={group.name}
                                                    onChange={(e) => updateColorGroup(group.id, 'name', e.target.value)}
                                                    className="w-full bg-transparent outline-none py-3 text-sm"
                                                    style={inputStyle}
                                                />
                                                {colorGroups.length > 1 && (
                                                    <button type="button" onClick={() => removeColorGroup(group.id)} className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#B5ADA3' }}>
                                                        remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>Color description</label>
                                                <textarea
                                                    value={group.description}
                                                    onChange={(e) => updateColorGroup(group.id, 'description', e.target.value)}
                                                    rows={3}
                                                    placeholder="Green-specific details"
                                                    className="w-full bg-transparent outline-none py-3 text-sm resize-none leading-relaxed placeholder:text-[#d0c5b5]"
                                                    style={inputStyle}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>Color price override</label>
                                                <input
                                                    type="number"
                                                    value={group.priceAmount}
                                                    onChange={(e) => updateColorGroup(group.id, 'priceAmount', e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Optional"
                                                    className={inputClass}
                                                    style={inputStyle}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>Color images</label>
                                                <span className="text-[10px]" style={{ color: '#B5ADA3' }}>{group.images.length}/7</span>
                                            </div>

                                            {group.images.length > 0 && (
                                                <div className="grid grid-cols-3 gap-2 mb-3">
                                                    {group.images.map((image, imageIndex) => (
                                                        <div key={imageIndex} className="relative aspect-square overflow-hidden group" style={{ backgroundColor: '#eae8e5' }}>
                                                            <img src={image.preview} alt={`Color preview ${imageIndex + 1}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGroupImage(group.id, imageIndex)}
                                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                                                                style={{ backgroundColor: 'rgba(27,24,20,0.55)', color: '#fbf9f6' }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {group.images.length < 7 && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => addGroupFiles(group.id, e.target.files)}
                                                    className="block w-full text-sm text-[#6e6258] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a] hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-xs file:tracking-wider file:font-serif cursor-pointer"
                                                />
                                            )}
                                        </div>

                                        <div className="rounded-lg border border-[#e4e2df] p-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>Available sizes</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addSizeRow(group.id)}
                                                    className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                                    style={{ color: '#C9A96E' }}
                                                >
                                                    + add size
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {group.sizes.map((sizeRow, sizeIndex) => (
                                                    <div key={sizeIndex} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="Size (M)"
                                                            value={sizeRow.size}
                                                            onChange={(e) => updateSizeRow(group.id, sizeIndex, 'size', e.target.value)}
                                                            className="bg-transparent outline-none py-3 text-sm"
                                                            style={inputStyle}
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Stock"
                                                            value={sizeRow.stock}
                                                            onChange={(e) => updateSizeRow(group.id, sizeIndex, 'stock', e.target.value)}
                                                            min="0"
                                                            className="bg-transparent outline-none py-3 text-sm"
                                                            style={inputStyle}
                                                        />
                                                        {group.sizes.length > 1 && (
                                                            <button type="button" onClick={() => removeSizeRow(group.id, sizeIndex)} className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#B5ADA3' }}>
                                                                remove
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                        {/* ── Submit Button ── */}
                        <div className="mt-16 lg:mt-20">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: isSubmitting ? '#7A6E63' : '#1b1c1a',
                                    color: '#fbf9f6',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }
                                }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;