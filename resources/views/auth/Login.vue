<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Login</h2>
      <LoginForm @submit="handleLogin" />
      <p class="auth-link">
        Don't have an account? <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogin = async (credentials) => {
  try {
    await authStore.login(credentials)
    router.push('/')
  } catch (error) {
    toast.error('Login failed. Please check your credentials.')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.auth-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.auth-link a {
  color: #4a6bdf;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
