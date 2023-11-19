import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
// import AboutView from '../views/AboutView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/index'
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/UserView.vue'), // 创建一个 UserView.vue 文件
    children: [
      {
        // 具体来说，UserView.vue 会被渲染到 /user 的路由视图中，
        // 而 UserHome.vue 会作为 UserView.vue 的子路由渲染到 <router-view> 中。这就是你定义的默认子路由的作用。
        path: '', // 默认子路由
        name: 'userhome',
        component: () => import('../views/UserHome.vue')
      },
      {
        path: 'article', // 默认子路由
        name: 'article',
        component: () => import('../views/ArticlePage.vue')
      },
      {
        path: 'blog/addBlog',
        name: 'addblog',
        component: () => import('../views/AddBlog.vue')
      },
      {
        path: 'blog/editBlog',
        name: 'editblog',
        component: () => import('../views/EditBlog.vue')
      },
  //     {
  //       path: 'blog/deleteBlog',
  //       name: 'delete-blog',
  //       component: () => import('../views/DeleteBlog.vue')
  //     }
    ]
  },
  {
    path: '/index',
    name: 'index',
    component: HomeView, // 创建一个 IndexView.vue 文件
    // children: [
    //   {
    //     path: 'search',
    //     name: 'search',
    //     component: () => import('../views/SearchView.vue')
    //   }
    // ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'), // 创建一个 AdminView.vue 文件
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/UserLogin.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/UserRegister.vue')
      },
      // {
      //   path: 'verifyCode',
      //   name: 'verify-code',
      //   component: () => import('../views/VerifyCode.vue')
      // }
    ]
  }
];

const router = createRouter({
  mode:'hash', // 默认为'hash
  history: createWebHashHistory(),
  routes
});

export default router;

