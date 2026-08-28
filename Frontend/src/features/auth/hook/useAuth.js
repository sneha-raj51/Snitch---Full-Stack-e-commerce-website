import { setError, setLoading, setUser } from "../state/auth.slice"
import { register, login, getMe, updateProfile, logout } from "../service/auth.api"
import { useDispatch } from "react-redux"



export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            const data = await register({ email, contact, password, fullname, isSeller })
            dispatch(setUser(data.user))
            dispatch(setError(null))
            return { success: true, user: data.user }
        } catch (error) {
            const message = error?.response?.data?.message || error?.response?.data?.errors?.map(e => e.msg).join(', ') || error.message || 'Registration failed'
            dispatch(setError(message))
            return { success: false, error: message }
        }
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleLogout() {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed', error)
        } finally {
            dispatch(setUser(null))
            dispatch(setError(null))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleUpdateProfile(profile) {
        try {
            const data = await updateProfile(profile)
            dispatch(setUser(data.user))
            return { success: true, user: data.user }
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Unable to update profile'
            dispatch(setError(message))
            return { success: false, error: message }
        }
    }

    return { handleRegister, handleLogin, handleLogout, handleGetMe, handleUpdateProfile }

}