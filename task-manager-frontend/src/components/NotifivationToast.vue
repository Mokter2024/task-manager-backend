<template>
  <!-- This component is just a placeholder -->
  <!-- The actual notifications are handled by vue-toastification -->
</template>

<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()

// Example method you can use throughout your app
const showSuccess = (message) => {
  toast.success(message)
}

const showError = (message) => {
  toast.error(message)
}

// Make these methods available to other components
defineExpose({
  showSuccess,
  showError
})
</script>
