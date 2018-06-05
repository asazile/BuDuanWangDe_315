import Vue from 'vue'
import Router from 'vue-router'

import axios from "axios";

const Login = () => import('./views/Login.vue');

const Home = () => import('./views/Home.vue');

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/Home',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        axios.get('/checkLogin')
            .then((response) => {
                let res = response.data;
                if(res.status) {
                    next();
                }else {
                    next({
                        path: '/',
                        query: { redirect: to.fullPath }
                    })
                }
            })
            .catch((error) => {
                next(error);
            });
    } else {
        next() // 确保一定要调用 next()
    }
});

router.onError((err) => {
    console.log(err);
});

export default router;
