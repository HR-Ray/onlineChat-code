import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import member from '@/components/member'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/member',
      name: 'member',
      component: member
    }
  ]
})

// 定义全局路由守卫，在所有访问操作之前
router.beforeEach(function(to, from, next) {
  let currUserId = sessionStorage.getItem('userId')
  // 未登录时，则必须最先进入登录界面（这是一种登录保护机制，注意要排除无需保护的界面）
  if (currUserId == null && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})

export default router
