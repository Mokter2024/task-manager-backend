<template>
  <div class="tasks-page">
    <AppHeader />
    <div class="page-layout">
      <AppSidebar />
      <main class="page-content">
        <div class="page-header">
          <h1>My Tasks</h1>
          <router-link to="/tasks/create" class="btn-primary">
            <i class="fas fa-plus"></i> New Task
          </router-link>
        </div>

        <div class="task-filters">
          <select v-model="statusFilter" @change="filterTasks">
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select v-model="priorityFilter" @change="filterTasks">
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search tasks..."
            @input="filterTasks"
          />
        </div>

        <div v-if="loading" class="loading">Loading tasks...</div>

        <TaskList
          v-else
          :tasks="filteredTasks"
          @edit="editTask"
          @delete="deleteTask"
        />

        <div v-if="!loading && filteredTasks.length === 0" class="empty-state">
          No tasks found. <router-link to="/tasks/create">Create one now</router-link>.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/tasks'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import TaskList from '@/components/tasks/TaskList.vue'

const router = useRouter()
const taskStore = useTaskStore()

const statusFilter = ref('')
const priorityFilter = ref('')
const searchQuery = ref('')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await taskStore.fetchTasks()
  loading.value = false
})

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(task => {
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    const matchesSearch = !searchQuery.value ||
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()))

    return matchesStatus && matchesPriority && matchesSearch
  })
})

const filterTasks = () => {
  // Reactivity handles the filtering automatically
}

const editTask = (task) => {
  router.push(`/tasks/${task.id}/edit`)
}

const deleteTask = async (id) => {
  try {
    await taskStore.deleteTask(id)
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}
</script>

<style scoped>
.tasks-page {
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

.btn-primary {
  background-color: #4a6bdf;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #3a5bd9;
}

.task-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.task-filters select, .task-filters input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-filters input {
  flex: 1;
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

.empty-state a {
  color: #4a6bdf;
  text-decoration: none;
}

.empty-state a:hover {
  text-decoration: underline;
}
</style>
