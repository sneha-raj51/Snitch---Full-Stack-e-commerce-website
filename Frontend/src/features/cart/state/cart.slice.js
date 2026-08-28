import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                } else {
                    return item
                }
            })
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                if (item.product._id === productId && item.variant === variantId) {
                    return { ...item, quantity: Math.max(1, item.quantity - 1) }
                } else {
                    return item
                }
            })
        },
        removeCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.filter(item => {
                const matchesProduct = item.product._id === productId
                const matchesVariant = item.variant === variantId
                return !(matchesProduct && matchesVariant)
            })
        }
    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem, removeCartItem } = cartSlice.actions
export default cartSlice.reducer