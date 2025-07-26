<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <div class="form-group">
      <label for="title">Title</label>
      <input
        type="text"
        id="title"
        v-model="form.title"
        required
        placeholder="Enter task title"
      />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        placeholder="Enter task description"
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="form.status" required>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="form-group">
        <label for="priority">Priority</label>
        <select id="priority" v-model="form.priority" required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label for="due_date">Due Date</label>
      <input
        type="date"
        id="due_date"
        v-model="form.due_date"
      />
    </div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="cancel">
        Cancel
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Task' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const toast = useToast()
const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      due_date: newTask.due_date ? newTask.due_date.split('T')[0] : ''
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  try {
    loading.value = true
    await emit('submit', form.value)
  } catch (error) {
    toast.error('Failed to save task. Please try again.')
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.task-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

.btn-secondary {
  background-color: white;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}
</style>
