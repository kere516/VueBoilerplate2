import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('beachtime_currentUser')
  
  if (to.meta.requiresAuth && !currentUser) {
    alert('Você precisa estar logado para acessar essa página')
    next('/auth')
  } else if (to.path === '/auth' && currentUser) {
    next('/home')
  } else {
    next()
  }
})

export default router