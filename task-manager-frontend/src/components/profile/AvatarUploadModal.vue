<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Upload Profile Picture</h3>
        <button class="modal-close" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="avatar-preview">
          <img v-if="previewUrl" :src="previewUrl" alt="Preview">
          <div v-else class="avatar-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div>

        <div class="upload-actions">
          <label class="btn-primary">
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleFileChange"
              style="display: none;"
            >
            Choose Image
          </label>

          <button
            class="btn-secondary"
            @click="cropImage"
            :disabled="!selectedFile"
          >
            Crop Image
          </button>
        </div>

        <div v-if="cropping" class="cropper-container">
          <vue-cropper
            ref="cropper"
            :src="previewUrl"
            :aspect-ratio="1"
            guides
          ></vue-cropper>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button
          class="btn-primary"
          @click="uploadAvatar"
          :disabled="!selectedFile || uploading"
        >
          <span v-if="uploading">
            <i class="fas fa-spinner fa-spin"></i> Uploading...
          </span>
          <span v-else>
            Upload
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

const emit = defineEmits(['close', 'uploaded'])

const toast = useToast()
const fileInput = ref(null)
const cropper = ref(null)

const selectedFile = ref(null)
const previewUrl = ref(null)
const cropping = ref(false)
const uploading = ref(false)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.match('image.*')) {
    toast.error('Please select an image file')
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  cropping.value = false
}

const cropImage = () => {
  if (!selectedFile.value) return
  cropping.value = true
}

const uploadAvatar = async () => {
  if (!selectedFile.value) return

  uploading.value = true

  try {
    let blob
    if (cropping.value) {
      blob = await new Promise(resolve => {
        cropper.value.getCroppedCanvas().toBlob(resolve)
      })
    } else {
      blob = selectedFile.value
    }

    // Here you would typically upload the blob to your server
    // For demonstration, we'll just create a mock URL
    const mockUrl = URL.createObjectURL(blob)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('uploaded', mockUrl)
    emit('close')
    toast.success('Avatar updated successfully')
  } catch (error) {
    toast.error('Failed to upload avatar')
    console.error(error)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.avatar-preview {
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 4rem;
  color: #ccc;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cropper-container {
  width: 100%;
  height: 300px;
  margin-bottom: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-primary {
  background-color: #4a6bdf;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
