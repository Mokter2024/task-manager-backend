import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/Dashboard.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/tasks',
            name: 'tasks',
            component: () => import('@/views/tasks/Index.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/tasks/trashed',
            name: 'trashed-tasks',
            component: () => import('@/views/tasks/Trashed.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/views/Profile.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue'),
            meta: { requiresGuest: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        try {
            await authStore.fetchUser()
            if (!authStore.isAuthenticated) {
                return next('/login')
            }
        } catch (error) {
            return next('/login')
        }
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        return next('/')
    }

    next()
})

export default router
