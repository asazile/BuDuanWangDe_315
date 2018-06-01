import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('./views/Login.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})
