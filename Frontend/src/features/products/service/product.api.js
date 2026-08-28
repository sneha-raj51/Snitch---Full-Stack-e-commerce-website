import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)

    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

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

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    ;(newProductVariant.images || []).forEach((image) => {
        if (image?.file) formData.append('images', image.file)
    })

    const priceValue = typeof newProductVariant.price === 'object'
        ? newProductVariant.price?.amount
        : newProductVariant.price;
    const priceCurrency = typeof newProductVariant.price === 'object'
        ? newProductVariant.price?.currency || 'INR'
        : 'INR';

    formData.append('stock', Number(newProductVariant.stock ?? 0))
    formData.append('priceAmount', Number(priceValue ?? 0))
    formData.append('priceCurrency', priceCurrency)
    formData.append('description', newProductVariant.description || '')
    formData.append('attributes', JSON.stringify(normalizeVariantAttributes(newProductVariant.attributes)))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data
}

export async function updateProduct(productId, updateData) {
    const response = await productApiInstance.put(`/${productId}`, updateData)
    return response.data
}

export async function deleteProduct(productId) {
    const response = await productApiInstance.delete(`/${productId}`)
    return response.data
}
