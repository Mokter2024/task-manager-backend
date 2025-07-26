<template>
  <div class="trashed-page">
    <AppHeader />
    <div class="page-layout">
      <AppSidebar />
      <main class="page-content">
        <div class="page-header">
          <h1>Trashed Tasks</h1>
          <router-link to="/tasks" class="btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Tasks
          </router-link>
        </div>

        <div v-if="loading" class="loading">Loading trashed tasks...</div>

        <div v-else-if="tasks.length === 0" class="empty-state">
          No trashed tasks found.
        </div>

        <div v-else class="trashed-list">
          <div v-for="task in tasks" :key="task.id" class="trashed-item">
            <h3>{{ task.title }}</h3>
            <p>Deleted on: {{ formatDate(task.deleted_at) }}</p>

            <div class="trashed-actions">
              <button @click="restoreTask(task.id)" class="btn-restore">
                <i class="fas fa-trash-restore"></i> Restore
              </button>
              <button @click="confirmForceDelete(task.id)" class="btn-delete">
                <i class="fas fa-trash"></i> Delete Permanently
              </button>
            </div>
          </div>
        </div>

        <ConfirmModal
          v-if="showConfirmModal"
          title="Permanently Delete Task"
          message="Are you sure you want to permanently delete this task? This action cannot be undone."
          @confirm="forceDeleteTask"
          @cancel="showConfirmModal = false"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useTaskStore } from '@/stores/tasks'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const taskStore = useTaskStore()
const toast = useToast()

const loading = ref(false)
const showConfirmModal = ref(false)
const taskToDelete = ref(null)

const tasks = computed(() => taskStore.trashedTasks)

onMounted(async () => {
  loading.value = true
  await taskStore.fetchTrashedTasks()
  loading.value = false
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const restoreTask = async (id) => {
  try {
    await taskStore.restoreTask(id)
    toast.success('Task restored successfully')
  } catch (error) {
    toast.error('Failed to restore task')
  }
}

const confirmForceDelete = (id) => {
  taskToDelete.value = id
  showConfirmModal.value = true
}

const forceDeleteTask = async () => {
  try {
    await taskStore.forceDeleteTask(taskToDelete.value)
    toast.success('Task permanently deleted')
  } catch (error) {
    toast.error('Failed to delete task')
  } finally {
    showConfirmModal.value = false
    taskToDelete.value = null
  }
}
</script>

<style scoped>
.trashed-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-secondary {
  background-color: white;
  color: #333;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: white;
  border-radius: 8px;
}

.trashed-list {
  display: grid;
  gap: 1rem;
}

.trashed-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.trashed-item h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.trashed-item p {
  color: #666;
  margin-bottom: 1rem;
}

.trashed-actions {
  display: flex;
  gap: 1rem;
}

.btn-restore, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-restore {
  background-color: #d4edda;
  color: #155724;
}

.btn-restore:hover {
  background-color: #c3e6cb;
}

.btn-delete {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-delete:hover {
  background-color: #f5c6cb;
}
</style>
