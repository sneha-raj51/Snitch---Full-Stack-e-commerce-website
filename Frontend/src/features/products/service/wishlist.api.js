import axios from 'axios'
import { API_BASE_URL } from "../../../config/api";

const wishlistApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/wishlist`,
    withCredentials: true
})

export async function getWishlist() {
    const response = await wishlistApiInstance.get('/')
    return response.data
}

export async function addToWishlist(productId) {
    const response = await wishlistApiInstance.post(`/add/${productId}`)
    return response.data
}

export async function removeFromWishlist(productId) {
    const response = await wishlistApiInstance.delete(`/remove/${productId}`)
    return response.data
}

export async function getWishlistStatus(productId) {
    const response = await wishlistApiInstance.get(`/status/${productId}`)
    return response.data
}
