import Vue from 'vue'
import Router from 'vue-router'

// Components / Vue
import login from '@/views/login.vue';
import register from '@/views/register.vue';
import main from '@/views/main.vue';
import post from '@/views/post.vue';
import writePost from '@/views/writePost.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: main
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    },
    {
      path: '/post/:idx',
      component: post
    },
    {
      path: '/write',
      component: writePost
    }
  ]
})
