import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Request interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const message = error.response.data.message || 'An error occurred'
            toast.error(message)

            if (error.response.status === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
