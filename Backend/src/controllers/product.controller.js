import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;
    const rawColors = req.body.colors ? JSON.parse(req.body.colors) : [];
    const files = req.files?.variantImages || [];

    const productImages = await Promise.all((req.files?.images || []).map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }));

    let currentFileIndex = 0;
    const colorFileGroups = rawColors.map(color => {
        const count = Number(color.imageCount || 0);
        const colorFiles = files.slice(currentFileIndex, currentFileIndex + count);
        currentFileIndex += count;
        return { color, colorFiles };
    });

    const colors = await Promise.all(colorFileGroups.map(async ({ color, colorFiles }) => {
        const colorImages = await Promise.all(colorFiles.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
        }));

        return {
            name: color.name,
            description: color.description || '',
            images: colorImages,
            sizes: (color.sizes || []).map((size) => ({
                size: size.size,
                stock: Number(size.stock || 0),
                price: {
                    amount: Number(size.price?.amount ?? priceAmount ?? 0),
                    currency: size.price?.currency || priceCurrency || 'INR'
                }
            }))
        };
    }));

    const variants = colors.flatMap((color) => {
        return (color.sizes || []).map((size) => ({
            description: color.description || '',
            stock: Number(size.stock || 0),
            price: size.price || {
                amount: Number(priceAmount ?? 0),
                currency: priceCurrency || 'INR'
            },
            attributes: {
                color: color.name,
                size: size.size
            },
            images: color.images || []
        }));
    });

    const firstColorImage = colors.find((color) => color.images && color.images.length > 0)?.images[0];
    const defaultProductImages = productImages.length > 0 ? productImages : (firstColorImage ? [firstColorImage] : []);

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images: defaultProductImages,
        seller: seller._id,
        colors,
        variants
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getAllProducts(req, res) {
    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function getProductDetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}


export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const normalizeColorName = (value) => (value ?? '').toString().trim().replace(/\s+/g, ' ').toLowerCase();

    const files = req.files || [];
    const uploadedImages = await Promise.all(files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        });
    }));

    const price = {
        amount: Number(req.body.priceAmount ?? product.price?.amount ?? 0),
        currency: req.body.priceCurrency || product.price?.currency || 'INR'
    };
    const stock = Number(req.body.stock ?? 0);
    const description = req.body.description || '';
    const attributes = JSON.parse(req.body.attributes || "{}");
    const colorName = attributes.color || '';
    const sizeName = attributes.size || '';

    if (!colorName || !sizeName) {
        return res.status(400).json({
            message: "Color and size are required",
            success: false
        });
    }

    const colorGroup = (product.colors || []).find((color) => {
        return normalizeColorName(color.name) === normalizeColorName(colorName);
    });

    const finalColorImages = uploadedImages.length > 0
        ? uploadedImages
        : (colorGroup?.images || []);

    if (colorGroup) {
        const existingImageUrls = new Set((colorGroup.images || []).map(image => image?.url || image));
        finalColorImages.forEach((image) => {
            const imageUrl = image?.url || image;
            if (imageUrl && !existingImageUrls.has(imageUrl)) {
                colorGroup.images.push(image);
                existingImageUrls.add(imageUrl);
            }
        });

        const existingSize = (colorGroup.sizes || []).find((size) => {
            return normalizeColorName(size.size) === normalizeColorName(sizeName);
        });

        if (existingSize) {
            existingSize.stock = stock;
            existingSize.price = price;
        } else {
            colorGroup.sizes.push({
                size: sizeName,
                stock,
                price
            });
        }
    } else {
        product.colors.push({
            name: colorName,
            description,
            images: finalColorImages,
            sizes: [{
                size: sizeName,
                stock,
                price
            }]
        });
    }

    const existingVariant = (product.variants || []).find((variant) => {
        const variantAttributes = variant.attributes || {};
        return normalizeColorName(variantAttributes.color) === normalizeColorName(colorName)
            && normalizeColorName(variantAttributes.size) === normalizeColorName(sizeName);
    });

    if (existingVariant) {
        existingVariant.images = finalColorImages;
        existingVariant.description = description;
        existingVariant.stock = stock;
        existingVariant.price = price;
        existingVariant.attributes = {
            color: colorName,
            size: sizeName
        };
    } else {
        product.variants.push({
            images: finalColorImages,
            description,
            price,
            stock,
            attributes: {
                color: colorName,
                size: sizeName
            }
        });
    }

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    })

}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const updateData = req.body; // In a real scenario, validate this.

        // Ensure the product belongs to the seller
        const product = await productModel.findOneAndUpdate(
            { _id: id, seller: seller._id },
            { $set: updateData },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized", success: false });
        }

        return res.status(200).json({ message: "Product updated successfully", success: true, product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;

        const product = await productModel.findOneAndDelete({ _id: id, seller: seller._id });

        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized", success: false });
        }

        return res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
}