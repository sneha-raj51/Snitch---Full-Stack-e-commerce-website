import { addItem, getCart, incrementCartItemApi, decrementCartItemApi, removeCartItemApi, createCartOrder, verifyCartOrder, getRazorpayConfig } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        const data = await incrementCartItemApi({ productId, variantId })
        dispatch(setCart(data.cart))
    }

    async function handleDecrementCartItem({ productId, variantId }) {
        const data = await decrementCartItemApi({ productId, variantId })
        dispatch(setCart(data.cart))
    }

    async function handleRemoveCartItem({ productId, variantId }) {
        const data = await removeCartItemApi({ productId, variantId })
        dispatch(setCart(data.cart))
    }

    async function handleCreateCartOrder({ addressId } = {}) {
        const data = await createCartOrder({ addressId })
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data
    }

    async function handleGetRazorpayConfig() {
        const data = await getRazorpayConfig()
        return data
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem, handleCreateCartOrder, handleVerifyCartOrder, handleGetRazorpayConfig }

}