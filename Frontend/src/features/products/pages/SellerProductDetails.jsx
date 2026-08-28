import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct';
import { useParams } from 'react-router';

// Helper icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const SellerProductDetails = () => {
  const [ product, setProduct ] = useState(null);
  const [ localVariants, setLocalVariants ] = useState([]);
  const [ isAddingVariant, setIsAddingVariant ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  const normalizeAttributes = (attrs) => {
    if (!attrs) return {};
    if (attrs instanceof Map) return Object.fromEntries(attrs);
    if (typeof attrs === 'object') return attrs;
    try {
      return JSON.parse(attrs);
    } catch {
      return {};
    }
  };

  const getDefaultProductImage = (productDoc) => {
    if (!productDoc) return null;
    const firstColorImage = productDoc?.colors?.find((color) => Array.isArray(color.images) && color.images.length > 0)?.images?.[0]?.url;
    const firstVariantImage = productDoc?.variants?.find((variant) => Array.isArray(variant.images) && variant.images.length > 0)?.images?.[0]?.url;
    return firstColorImage || firstVariantImage || productDoc?.images?.[0]?.url || null;
  };

  const normalizeVariant = (variant) => ({
    ...variant,
    attributes: normalizeAttributes(variant.attributes)
  });

  const [ colorName, setColorName ] = useState('');
  const [ sizeEntries, setSizeEntries ] = useState([ { size: '', stock: 0 } ]);
  const colorPresets = [ 'Green', 'Pink', 'Black', 'White', 'Blue', 'Beige', 'Red', 'Purple', 'Yellow', 'Orange' ];

  // New variant state
  const [ newVariant, setNewVariant ] = useState({
    images: [],
    stock: 0,
    description: '',
    attributes: {}, // Strictly an object
    price: { amount: '', currency: 'INR' }
  });

  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await handleGetProductById(productId);
        const prod = data?.product || data;
        setProduct(prod);
        // Initialize variants locally and normalize any Map-based attributes
        if (prod?.variants) {
          setLocalVariants(prod.variants.map(normalizeVariant));
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [ productId, handleGetProductById ]);

  // Handlers for modifying existing variant stock natively
  const handleStockChange = (index, newStock) => {
    const updatedVariants = [ ...localVariants ];
    updatedVariants[ index ] = { ...updatedVariants[ index ], stock: Number(newStock) };
    setLocalVariants(updatedVariants);
  };

  // Handlers for New Variant Form
  const handleAddNewVariant = async () => {
    const normalizedColor = colorName.trim();
    const validSizes = sizeEntries.filter(entry => entry.size && entry.size.trim());

    if (!normalizedColor) {
      alert("Please choose a color name.");
      return;
    }

    if (!validSizes.length) {
      alert("Please add at least one size and its stock.");
      return;
    }

    const cleanImages = newVariant.images.map(img => ({ url: img.previewUrl, file: img.file }));
    const createdVariants = validSizes.map(({ size, stock }) => {
      const attributes = {
        ...(newVariant.attributes || {}),
        color: normalizedColor,
        size: size.trim()
      };

      return {
        images: cleanImages,
        stock: Number(stock || 0),
        description: newVariant.description,
        attributes,
        price: newVariant.price.amount
          ? Number(newVariant.price.amount)
          : undefined
      };
    });

    setLocalVariants([ ...localVariants, ...createdVariants ]);
    setIsAddingVariant(false);

    for (const variant of createdVariants) {
      await handleAddProductVariant(productId, variant)
    }
    await fetchProductDetails();

    setColorName('');
    setSizeEntries([ { size: '', stock: 0 } ]);
    setNewVariant({
      images: [],
      stock: 0,
      description: '',
      attributes: {},
      price: { amount: '', currency: 'INR' }
    });
  };

  const handleAddSizeEntry = () => {
    setSizeEntries(prev => [ ...prev, { size: '', stock: 0 } ]);
  };

  const handleSizeEntryChange = (index, field, value) => {
    const updated = [ ...sizeEntries ];
    updated[ index ] = { ...updated[ index ], [ field ]: field === 'stock' ? Number(value || 0) : value };
    setSizeEntries(updated);
  };

  const handleRemoveSizeEntry = (index) => {
    setSizeEntries(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = 7 - newVariant.images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setNewVariant(prev => ({
      ...prev,
      images: [ ...prev.images, ...newImageObjects ]
    }));

    // Clear the input so identical files can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = newVariant.images[ index ];
    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    const updatedImages = newVariant.images.filter((_, i) => i !== index);
    setNewVariant(prev => ({ ...prev, images: updatedImages }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Loading gallery...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#fbf9f6] flex items-center justify-center text-[#1b1c1a] font-serif">Product Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] font-sans pb-24">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-10 bg-[#fbf9f6]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-xl tracking-wide uppercase">{product.title?.substring(0, 20)}{product.title?.length > 20 ? '...' : ''}</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8">

        {/* Base Product Info */}
        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="w-full md:w-1/2">
            {/* Gallery placeholder */}
            <div className="w-full aspect-[4/5] bg-[#f5f3f0] overflow-hidden">
              {getDefaultProductImage(product) ? (
                <img src={getDefaultProductImage(product)} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7f7668]">No Image</div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images.slice(1).map((img, i) => (
                  <img key={i} src={img.url} alt={`Thumb ${i}`} className="w-16 h-20 object-cover bg-[#f5f3f0] shrink-0" />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-4 uppercase">{product.title}</h2>
            <p className="text-[#6e6258] text-lg mb-6 leading-relaxed max-w-md">{product.description}</p>
            <div className="text-2xl tracking-wide font-light mb-8">
              {product.price?.amount} {product.price?.currency}
            </div>
          </div>
        </section>

        {/* Variants & Inventory */}
        <section className="bg-[#f5f3f0] p-6 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <h3 className="font-serif text-3xl uppercase">Variants & Inventory</h3>
            {!isAddingVariant && (
              <button
                onClick={() => setIsAddingVariant(true)}
                className="bg-[#745a27] text-[#ffffff] px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#5a4312] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon /> Add New Variant
              </button>
            )}
          </div>

          {/* Add New Variant Form */}
          {isAddingVariant && (
            <div className="bg-[#ffffff] p-6 md:p-8 mb-12 shadow-[0_20px_40px_rgba(27,28,26,0.04)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#7f7668]">Add color set</p>
                  <h4 className="font-serif text-2xl uppercase mt-2">Create Color Variant</h4>
                </div>
                <button
                  onClick={() => setIsAddingVariant(false)}
                  className="text-[#7f7668] hover:text-[#1b1c1a] text-sm uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#efeae4] bg-[#fbf9f6] p-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258] mb-3">Color</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setColorName(preset)}
                          className={`px-3 py-2 text-[10px] uppercase tracking-[0.14em] border transition ${colorName === preset ? 'border-[#745a27] bg-[#745a27] text-white' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#745a27]'}`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter custom color"
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                    />
                  </div>

                  <div className="rounded-2xl border border-[#efeae4] bg-[#fbf9f6] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258]">Sizes & stock</label>
                      <button
                        type="button"
                        onClick={handleAddSizeEntry}
                        className="text-[#745a27] text-[10px] uppercase tracking-[0.14em] flex items-center gap-1 hover:text-[#5a4312] cursor-pointer"
                      >
                        <PlusIcon /> Add size
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sizeEntries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Size (M)"
                            value={entry.size}
                            onChange={(e) => handleSizeEntryChange(index, 'size', e.target.value)}
                            className="bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                          />
                          <input
                            type="number"
                            placeholder="Stock"
                            value={entry.stock}
                            min="0"
                            onChange={(e) => handleSizeEntryChange(index, 'stock', e.target.value)}
                            className="bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                          />
                          {sizeEntries.length > 1 && (
                            <button type="button" onClick={() => handleRemoveSizeEntry(index)} className="text-[#ba1a1a] p-2 hover:bg-[#ffdad6] transition-colors cursor-pointer">
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#efeae4] bg-[#fbf9f6] p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258] mb-2">Price override</label>
                        <input
                          type="number"
                          value={newVariant.price.amount}
                          onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                          placeholder="Optional"
                          className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258] mb-2">Base stock</label>
                        <input
                          type="number"
                          value={newVariant.stock}
                          onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                          className="w-full bg-transparent border-b border-[#d0c5b5] py-2 focus:outline-none focus:border-[#745a27]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#efeae4] bg-[#fbf9f6] p-4">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258] mb-2">Variant description</label>
                    <textarea
                      value={newVariant.description}
                      onChange={(e) => setNewVariant({ ...newVariant, description: e.target.value })}
                      rows={4}
                      placeholder="Describe this color tone, fabric feel, or fit for this color group"
                      className="w-full bg-transparent border border-[#d0c5b5] p-3 focus:outline-none focus:border-[#745a27] placeholder:text-[#d0c5b5]"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#efeae4] bg-[#fbf9f6] p-4">
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6e6258]">Images</label>
                    <span className="text-xs text-[#7f7668]">{newVariant.images.length}/7</span>
                  </div>

                  {newVariant.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {newVariant.images.map((img, index) => (
                        <div key={index} className="relative aspect-[4/5] bg-[#f5f3f0] overflow-hidden border border-[#ede8e3]">
                          <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-white/85 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {newVariant.images.length < 7 && (
                    <div className="rounded-xl border border-dashed border-[#d0c5b5] p-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-[#6e6258]
                          file:mr-4 file:py-2 file:px-4
                          file:border-0 file:bg-[#f5f3f0] file:text-[#1b1c1a]
                          hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-xs file:tracking-wider file:font-serif
                          cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="mt-6 rounded-xl bg-[#f5f3f0] p-3 text-xs leading-relaxed text-[#6e6258]">
                    Each size you add will become a separate variant under this color, so Green + M and Green + XL stay independent in stock and cart.
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleAddNewVariant}
                  className="bg-gradient-to-r from-[#745a27] to-[#c9a96e] text-[#ffffff] px-8 py-3 uppercase tracking-wider text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save color set
                </button>
              </div>
            </div>
          )}

          {/* Variants List */}
          {localVariants.length === 0 ? (
            <div className="py-12 text-center text-[#6e6258]">
              <p>No variants have been created yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {localVariants.map((variant, idx) => (
                <div key={idx} className="bg-[#ffffff] flex flex-col pt-4 shadow-[0_20px_40px_rgba(27,28,26,0.02)]">
                  <div className="px-6 flex gap-4 h-24 mb-4">
                    {/* Variant Thumb */}
                    <div className="w-16 h-20 bg-[#f5f3f0] shrink-0">
                      {variant.images && variant.images.length > 0 ? (
                        <img src={variant.images[ 0 ].url} alt="Variant" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7f7668]">N/A</div>
                      )}
                    </div>
                    {/* Attributes */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Object.entries(variant.attributes || {}).map(([ key, val ]) => (
                          <span key={key} className="bg-[#f5f3f0] px-2 py-1 text-xs uppercase tracking-wider text-[#4d463a]">
                            <span className="text-[#a8a094]">{key}:</span> {val}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm font-light">
                        {variant.price?.amount ? `${variant.price.amount} ${variant.price.currency}` : 'Base Price'}
                      </div>
                      {variant.attributes?.color && variant.attributes?.size && (
                        <div className="mt-2 text-[11px] uppercase tracking-wider text-[#6e6258]">
                          {variant.attributes.color} / {variant.attributes.size}
                        </div>
                      )}
                      {variant.description && (
                        <div className="mt-2 text-xs leading-relaxed text-[#6e6258]">
                          {variant.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stock Management Row */}
                  <div className="mt-auto border-t border-[#f5f3f0] bg-[#fbf9f6] flex items-center px-6 py-3 justify-between">
                    <label className="text-sm text-[#6e6258] uppercase tracking-wider">Current Stock</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={variant.stock || 0}
                        onChange={(e) => handleStockChange(idx, e.target.value)}
                        className="w-20 bg-transparent border-b border-[#d0c5b5] py-1 text-right focus:outline-none focus:border-[#745a27] font-serif text-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default SellerProductDetails