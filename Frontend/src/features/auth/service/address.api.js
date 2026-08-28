import axios from 'axios'

const addressApiInstance = axios.create({
    baseURL: '/api/addresses',
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
