import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile',
    children: [{
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/index'),
      meta: { title: '个人中心', icon: 'user' },
      hidden:true
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: 'noRedirect',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'ordinary',
        name: 'Ordinary',
        component: () => import('@/views/user/ordinary'),
        meta: { title: '普通用户', icon: 'user' }
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Business',
    children: [
      {
        path: 'business',
        name: 'oBusiness',
        component: () => import('@/views/business/index'),
        meta: { title: '厂商管理', icon: 'shop' }
      }
    ]
  },

  {
    path: '/review',
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: 'review',
        name: 'Review',
        component: () => import('@/views/review/index'),
        meta: { title: '审核中心', icon: 'review' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    alwaysShow: true,
    redirect: 'noRedirect',
    name: 'Product',
    meta: { title: '商品', icon: 'product' },
    children: [
      {
        path: 'productM',
        name: 'ProductM',
        component: () => import('@/views/product/index'),
        meta: { title: '商品管理', icon: 'productList' },
      },
      {
        path: 'productListAdd',
        name: 'ProductListAdd',
        component: () => import('@/views/product/productList'),
        meta: {title: '添加商品属性'},
        hidden: true
      },
      {
        path: 'productCate',
        name: 'ProductCate',
        component: () => import('@/views/product/productCate'),
        meta: { title: '商品分类', icon: 'productCate' }
      },
      {
        path: 'productListModify',
        name: 'ProductListModify',
        component: () => import('@/views/product/productList'),
        meta: { title: '修改商品属性' },
        hidden: true
      }

    ]
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Marketing',
    children: [
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/marketing/coupon'),
        meta: { title: '营销管理', icon: 'example' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Setting',
    meta: { title: '系统设置', icon: 'set' },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/setting/admin'),
        meta: { title: '管理人员', icon: 'tree-table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/setting/role'),
        meta: { title: '角色权限', icon: 'role' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
