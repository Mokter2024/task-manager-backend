<template>
  <header class="app-header">
    <div class="header-left">
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="app-title">Task Manager</h1>
    </div>

    <div class="header-right">
      <div class="user-menu">
        <div class="user-avatar" @click="toggleUserMenu">
          <img v-if="user.avatar" :src="user.avatar" alt="User Avatar">
          <div v-else class="avatar-placeholder">
            {{ userInitials }}
          </div>
        </div>

        <div v-if="userMenuOpen" class="dropdown-menu">
          <router-link to="/profile" class="dropdown-item">
            <i class="fas fa-user"></i> Profile
          </router-link>
          <button @click="logout" class="dropdown-item">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const userMenuOpen = ref(false)

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value.name) return ''
  const names = user.value.name.split(' ')
  return names.map(name => name[0]).join('').toUpperCase()
})

const toggleSidebar = () => {
  // Implement sidebar toggle logic if needed
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.app-header {
  background-color: #4a6bdf;
  color: white;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
}

.app-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-weight: bold;
  color: #495057;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
}
</style>
