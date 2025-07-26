import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useTaskStore = defineStore('tasks', {
    state: () => ({
        tasks: [],
        trashedTasks: [],
        loading: false
    }),
    actions: {
        async fetchTasks() {
            this.loading = true
            try {
                const response = await api.get('/tasks')
                this.tasks = response.data
            } finally {
                this.loading = false
            }
        },
        async createTask(taskData) {
            try {
                const response = await api.post('/tasks', taskData)
                this.tasks.unshift(response.data)
                return response.data
            } catch (error) {
                throw error
            }
        },
        async updateTask({ id, ...taskData }) {
            try {
                const response = await api.put(`/tasks/${id}`, taskData)
                const index = this.tasks.findIndex(task => task.id === id)
                if (index !== -1) {
                    this.tasks.splice(index, 1, response.data)
                }
                return response.data
            } catch (error) {
                throw error
            }
        },
        async deleteTask(id) {
            try {
                await api.delete(`/tasks/${id}`)
                this.tasks = this.tasks.filter(task => task.id !== id)
            } catch (error) {
                throw error
            }
        },
        async fetchTrashedTasks() {
            try {
                const response = await api.get('/tasks/trashed')
                this.trashedTasks = response.data
            } catch (error) {
                throw error
            }
        },
        async restoreTask(id) {
            try {
                const response = await api.post(`/tasks/${id}/restore`)
                this.trashedTasks = this.trashedTasks.filter(task => task.id !== id)
                this.tasks.unshift(response.data)
                return response.data
            } catch (error) {
                throw error
            }
        },
        async forceDeleteTask(id) {
            try {
                await api.delete(`/tasks/${id}/force`)
                this.trashedTasks = this.trashedTasks.filter(task => task.id !== id)
            } catch (error) {
                throw error
            }
        }
    }
})
