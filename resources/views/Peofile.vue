<template>
  <div class="profile-page">
    <AppHeader />
    <div class="page-layout">
      <AppSidebar />
      <main class="page-content">
        <div class="page-header">
          <h1>My Profile</h1>
        </div>

        <div class="profile-container">
          <div class="profile-card">
            <div class="profile-avatar">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                alt="Profile Avatar"
                class="avatar-image"
              >
              <div v-else class="avatar-placeholder">
                {{ userInitials }}
              </div>
              <button
                class="avatar-upload-btn"
                @click="showAvatarUpload = true"
              >
                <i class="fas fa-camera"></i>
              </button>
            </div>

            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label>Name</label>
                <input
                  type="text"
                  v-model="profileForm.name"
                  required
                >
              </div>

              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  v-model="profileForm.email"
                  required
                  disabled
                >
              </div>

              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>

          <div class="password-card">
            <h3>Change Password</h3>
            <form @submit.prevent="changePassword" class="password-form">
              <div class="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  v-model="passwordForm.current_password"
                  required
                >
              </div>

              <div class="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  v-model="passwordForm.password"
                  required
                >
              </div>

              <div class="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  v-model="passwordForm.password_confirmation"
                  required
                >
              </div>

              <button type="submit" class="btn-primary" :disabled="passwordLoading">
                {{ passwordLoading ? 'Updating...' : 'Update Password' }}
              </button>
            </form>
          </div>
        </div>

        <AvatarUploadModal
          v-if="showAvatarUpload"
          @close="showAvatarUpload = false"
          @uploaded="handleAvatarUploaded"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AvatarUploadModal from '@/components/profile/AvatarUploadModal.vue'

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const passwordLoading = ref(false)
const showAvatarUpload = ref(false)

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value.name) return ''
  const names = user.value.name.split(' ')
  return names.map(name => name[0]).join('').toUpperCase()
})

const profileForm = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name,
      email: user.value.email
    }
  }
})

const updateProfile = async () => {
  try {
    loading.value = true
    await authStore.updateProfile(profileForm.value)
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  try {
    passwordLoading.value = true
    await authStore.changePassword(passwordForm.value)
    toast.success('Password changed successfully')
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
  } catch (error) {
    toast.error('Failed to change password')
  } finally {
    passwordLoading.value = false
  }
}

const handleAvatarUploaded = (avatarUrl) => {
  user.value.avatar = avatarUrl
  showAvatarUpload.value = false
  toast.success('Avatar updated successfully')
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  flex: 1;
}

.page-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

.page-header {
  margin-bottom: 2rem;
}

.profile-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-card, .password-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.password-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.avatar-image, .avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #495057;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4a6bdf;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload-btn:hover {
  background-color: #3a5bd9;
}

.profile-form, .password-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-primary {
  background-color: #4a6bdf;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #3a5bd9;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
