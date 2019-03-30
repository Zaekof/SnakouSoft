import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'youtube',
      component: require('@/components/Youtube').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
