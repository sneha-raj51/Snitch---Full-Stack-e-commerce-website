import axios from 'axios'
import { API_BASE_URL } from "../../../config/api";

const addressApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/addresses`,
    withCredentials: true
})

export async function getAddresses() {
    const response = await addressApiInstance.get('/')
    return response.data
}

export async function addAddress(address) {
    const response = await addressApiInstance.post('/', address)
    return response.data
}

export async function updateAddress(addressId, address) {
    const response = await addressApiInstance.patch(`/${addressId}`, address)
    return response.data
}

export async function deleteAddress(addressId) {
    const response = await addressApiInstance.delete(`/${addressId}`)
    return response.data
}
