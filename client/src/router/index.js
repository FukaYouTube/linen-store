import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import AdminPanel from '../views/Admin.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'LinenStore - Гланая',
      component: Home
    },
    {
      path: '/cart',
      name: 'LinenStore - Моя корзина',
      component: Cart
    },
    {
      path: '/admin_panel',
      name: 'LinenStore - Панель администратора',
      component: AdminPanel
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  next()
})

export default router