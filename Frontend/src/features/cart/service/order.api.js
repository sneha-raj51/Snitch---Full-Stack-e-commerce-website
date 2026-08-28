import axios from 'axios'
import { API_BASE_URL } from "../../../config/api";

const orderApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/orders`,
    withCredentials: true
})

export async function getOrders() {
    const response = await orderApiInstance.get('/')
    return response.data
}

export async function getOrderById(orderId) {
    const response = await orderApiInstance.get(`/${orderId}`)
    return response.data
}

export async function getSellerOrders() {
    const response = await orderApiInstance.get('/seller')
    return response.data
}

export async function updateOrderStatus(orderId, status) {
    const response = await orderApiInstance.patch(`/${orderId}/status`, { status })
    return response.data
}

export async function getSellerDashboardStats() {
    const response = await orderApiInstance.get('/seller/stats')
    return response.data
}
