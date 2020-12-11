import Vue from 'vue'
import VueRouter from 'vue-router';

import Home from './views/Home'
import Dashboard from './views/Dashboard'
import Profile from './views/Profile'
import Status from './views/Status'
import Users from './views/Users'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/dash',
            name: 'dashboard',
            component: Dashboard,
        },
        {
            path: '/users',
            name: 'users',
            component: Users,
        },
        {
            path: '/me',
            name: 'profile',
            component: Profile,
        },
        {
            path: '/:userIP',
            name: 'userprofile',
            component: Profile,
        },
        {
            path: '/:userIP/status/:postId',
            name: 'status',
            component: Status,
        }
    ]
});

export default router;