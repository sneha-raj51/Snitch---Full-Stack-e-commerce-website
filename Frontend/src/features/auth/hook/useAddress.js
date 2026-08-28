import { useAuth } from '../hook/useAuth'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../service/address.api'

export const useAddress = () => {
    const { handleGetMe } = useAuth()

    async function handleGetAddresses() {
        const data = await getAddresses()
        return data.addresses
    }

    async function handleAddAddress(address) {
        const data = await addAddress(address)
        await handleGetMe()
        return data.address
    }

    async function handleUpdateAddress(addressId, address) {
        const data = await updateAddress(addressId, address)
        await handleGetMe()
        return data.address
    }

    async function handleDeleteAddress(addressId) {
        const data = await deleteAddress(addressId)
        await handleGetMe()
        return data
    }

    return { handleGetAddresses, handleAddAddress, handleUpdateAddress, handleDeleteAddress }
}
