import { getOrders, getOrderById } from '../service/order.api'

export const useOrder = () => {
    async function handleGetOrders() {
        const data = await getOrders()
        return data.orders
    }

    async function handleGetOrderById(orderId) {
        const data = await getOrderById(orderId)
        return data.order
    }

    return { handleGetOrders, handleGetOrderById }
}
