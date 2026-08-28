import { useDispatch } from 'react-redux'
import { setWishlist } from '../state/wishlist.slice'
import { getWishlist, addToWishlist, removeFromWishlist, getWishlistStatus } from '../service/wishlist.api'

export const useWishlist = () => {
    const dispatch = useDispatch()

    async function handleGetWishlist() {
        const data = await getWishlist()
        dispatch(setWishlist(data.wishlist || []))
        return data.wishlist
    }

    async function handleAddToWishlist(productId) {
        const data = await addToWishlist(productId)
        return data
    }

    async function handleRemoveFromWishlist(productId) {
        const data = await removeFromWishlist(productId)
        return data
    }

    async function handleGetWishlistStatus(productId) {
        const data = await getWishlistStatus(productId)
        return data.inWishlist
    }

    return { handleGetWishlist, handleAddToWishlist, handleRemoveFromWishlist, handleGetWishlistStatus }
}
