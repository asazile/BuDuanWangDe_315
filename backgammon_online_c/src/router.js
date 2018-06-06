import Vue from 'vue'
import Router from 'vue-router'

import axios from "axios";
import { Loading } from 'element-ui';

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
    const loading = Loading.service({
        lock: true,
        text: 'Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        axios.get('/checkLogin')
            .then((response) => {
                let res = response.data;
                if(res.status) {
                    loading.close();
                    next();
                }else {
                    loading.close();
                    next({
                        path: '/',
                        query: { redirect: to.fullPath }
                    })
                }
            })
            .catch((error) => {
                next(error);
            });

    } else if(to.path === '/') {
        axios.get('/checkLogin')
            .then((response) => {
                let res = response.data;
                if(res.status) {
                    loading.close();
                    next({
                        path: '/home',
                        query: { redirect: to.fullPath}
                    });
                }else {
                    loading.close();
                    next()
                }
            })
            .catch((error) => {
                next(error);
            });

    } else {
        loading.close();
        next();
    }
});

router.onError((err) => {
    console.log(err);
});

export default router;
