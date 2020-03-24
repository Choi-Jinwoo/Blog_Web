import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/main/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue')
  },
  {
    path: '/write',
    name: 'Write',
    component: () => import('@/views/write/index.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/index.vue'),
  },
  {
    path: '/notice',
    name: 'Notice',
    component: () => import('@/views/notice/index.vue'),
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    component: () => import('@/views/subscribe/index.vue'),
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: () => import('@/views/notfound/index.vue'),
  },
  {
    path: '/:idx',
    name: 'Post',
    component: () => import('@/views/post/index.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
