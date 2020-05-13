import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/main/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/write',
    name: 'Write',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/write/index.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/admin/index.vue'),
  },
  {
    path: '/notice',
    name: 'Notice',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/notice/index.vue'),
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    meta: {
      title: 'wlswoo blog'
    },
    component: () => import('@/views/subscribe/index.vue'),
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: () => import('@/views/notfound/index.vue'),
  },
  {
    path: '/post/:idx',
    name: 'Post',
    component: () => import('@/views/post/index.vue'),
  },
  {
    path: '/*',
    name: 'NotFound',
    component: () => import('@/views/notfound/index.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router
