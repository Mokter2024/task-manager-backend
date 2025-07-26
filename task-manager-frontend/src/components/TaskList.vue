<template>
    <div class="task-list">
        <div v-if="loading" class="loading">Loading tasks...</div>

        <div v-else>
            <div v-if="tasks.length === 0" class="empty-state">
                No tasks found. Create your first task!
            </div>

            <div v-for="task in tasks" :key="task.id" class="task-item">
                <h3>{{ task.title }}</h3>
                <p>{{ task.description }}</p>
                <div class="task-meta">
                    <span class="badge" :class="task.status">{{ task.status }}</span>
                    <span class="badge" :class="task.priority">{{ task.priority }}</span>
                    <span v-if="task.due_date">Due: {{ formatDate(task.due_date) }}</span>
                </div>
                <div class="task-actions">
                    <button @click="editTask(task)">Edit</button>
                    <button @click="deleteTask(task.id)">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/tasks'
import { useToast } from 'vue-toastification'

const toast = useToast()
const taskStore = useTaskStore()

const tasks = computed(() => taskStore.tasks)
const loading = computed(() => taskStore.loading)

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
}

const editTask = (task) => {
    // Emit event or navigate to edit page
}

const deleteTask = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await taskStore.deleteTask(id)
            toast.success('Task deleted successfully')
        } catch (error) {
            toast.error('Failed to delete task')
        }
    }
}
</script>

<style scoped>
.task-list {
    max-width: 800px;
    margin: 0 auto;
}

.task-item {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-meta {
    display: flex;
    gap: 8px;
    margin: 8px 0;
}

.badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    text-transform: capitalize;
}

.badge.todo {
    background: #f0f0f0;
}

.badge.in_progress {
    background: #fff3cd;
}

.badge.completed {
    background: #d4edda;
}

.badge.low {
    background: #d1ecf1;
}

.badge.medium {
    background: #ffeeba;
}

.badge.high {
    background: #f8d7da;
}

.task-actions {
    display: flex;
    gap: 8px;
}

.empty-state {
    text-align: center;
    padding: 32px;
    color: #666;
}

.loading {
    text-align: center;
    padding: 32px;
}
</style>
