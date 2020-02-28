import Vue from 'vue'
import Router from 'vue-router'

// Components / Vue
import loginContainer from '../components/login/loginContainer';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: loginContainer
    }
  ]
})
