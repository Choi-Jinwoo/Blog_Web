import Vue from 'vue'
import Router from 'vue-router'

// Components / Vue
import login from '@/views/login';
import register from '@/views/register';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    }
  ]
})
