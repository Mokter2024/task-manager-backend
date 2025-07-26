<template>
  <div class="dashboard">
    <AppHeader />
    <div class="dashboard-layout">
      <AppSidebar />
      <main class="dashboard-content">
        <h1>Welcome, {{ user.name }}!</h1>

        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Tasks</h3>
            <p>{{ taskStats.total }}</p>
          </div>
          <div class="stat-card">
            <h3>Completed</h3>
            <p>{{ taskStats.completed }}</p>
          </div>
          <div class="stat-card">
            <h3>In Progress</h3>
            <p>{{ taskStats.in_progress }}</p>
          </div>
          <div class="stat-card">
            <h3>Due Soon</h3>
            <p>{{ taskStats.due_soon }}</p>
          </div>
        </div>

        <div class="recent-tasks">
          <h2>Recent Tasks</h2>
          <TaskList :tasks="recentTasks" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import TaskList from '@/components/tasks/TaskList.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const user = computed(() => authStore.user)
const recentTasks = computed(() => taskStore.tasks.slice(0, 5))

const taskStats = computed(() => {
  return {
    total: taskStore.tasks.length,
    completed: taskStore.tasks.filter(t => t.status === 'completed').length,
    in_progress: taskStore.tasks.filter(t => t.status === 'in_progress').length,
    due_soon: taskStore.tasks.filter(t => {
      if (!t.due_date) return false
      const dueDate = new Date(t.due_date)
      const today = new Date()
      const diffTime = dueDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && diffDays >= 0
    }).length
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-layout {
  display: flex;
  flex: 1;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0 0;
  color: #333;
}

.recent-tasks {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
