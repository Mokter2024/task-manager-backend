import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await api.post('/login', credentials)
                localStorage.setItem('token', response.data.access_token)
                this.user = response.data.user
                this.isAuthenticated = true
                toast.success('Login successful')
                return response.data
            } catch (error) {
                throw error
            }
        },
        async register(userData) {
            try {
                const response = await api.post('/register', userData)
                toast.success('Registration successful. Please login.')
                return response.data
            } catch (error) {
                throw error
            }
        },
        async logout() {
            try {
                await api.post('/logout')
                localStorage.removeItem('token')
                this.user = null
                this.isAuthenticated = false
                toast.success('Logged out successfully')
            } catch (error) {
                throw error
            }
        },
        async fetchUser() {
            try {
                const response = await api.get('/profile')
                this.user = response.data
                this.isAuthenticated = true
                return response.data
            } catch (error) {
                this.user = null
                this.isAuthenticated = false
                throw error
            }
        }
    }
})
