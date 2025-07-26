<template>
  <aside class="app-sidebar" :class="{ 'collapsed': isCollapsed }">
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" active-class="active">
        <i class="fas fa-tachometer-alt"></i>
        <span class="nav-text">Dashboard</span>
      </router-link>

      <router-link to="/tasks" class="nav-item" active-class="active">
        <i class="fas fa-tasks"></i>
        <span class="nav-text">Tasks</span>
      </router-link>

      <router-link to="/tasks/trashed" class="nav-item" active-class="active">
        <i class="fas fa-trash"></i>
        <span class="nav-text">Trashed Tasks</span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <i class="fas fa-user"></i>
        <span class="nav-text">Profile</span>
      </router-link>
    </nav>

    <button class="sidebar-toggle" @click="toggleSidebar">
      <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: 0;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 900;
}

.app-sidebar.collapsed {
  width: 60px;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-item i {
  width: 24px;
  text-align: center;
  margin-right: 1rem;
}

.nav-text {
  white-space: nowrap;
}

.app-sidebar.collapsed .nav-text {
  display: none;
}

.sidebar-toggle {
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  text-align: center;
}

.sidebar-toggle:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
