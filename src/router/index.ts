import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import LayoutIndex from '../layout/index.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'Home',
        component: LayoutIndex,
        children: [
            {
                path: '/',
                name: '首页',
                component: () => import('../views/Generator.vue')
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
