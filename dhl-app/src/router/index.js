import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import DashboardView from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } // Protects this specific operational view
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation Guard: Evaluates security clearances before every step
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      console.warn('Unauthorized routing trace detected. Redirecting to gateway panel.');
      next({ name: 'login' });
    } else {
      next(); // Stored token found, let them in!
    }
  } else {
    next(); // Destined for a non-protected asset, continue
  }
});

export default router;