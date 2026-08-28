import axios from "axios"


const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})


export const addItem = async ({ productId, variantId }) => {
    const path = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`
    const response = await cartApiInstance.post(path, {
        quantity: 1
    })

    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const path = variantId ? `/quantity/increment/${productId}/${variantId}` : `/quantity/increment/${productId}`
    const response = await cartApiInstance.patch(path)
    return response.data
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const path = variantId ? `/quantity/decrement/${productId}/${variantId}` : `/quantity/decrement/${productId}`
    const response = await cartApiInstance.patch(path)
    return response.data
}

export const removeCartItemApi = async ({ productId, variantId }) => {
    const path = variantId ? `/quantity/remove/${productId}/${variantId}` : `/quantity/remove/${productId}`
    const response = await cartApiInstance.delete(path)
    return response.data
}

export const createCartOrder = async ({ addressId }) => {
    const response = await cartApiInstance.post("/payment/create/order", { addressId })
    return response.data
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return response.data
}

export const getRazorpayConfig = async () => {
    const response = await cartApiInstance.get("/payment/config")
    return response.data
}