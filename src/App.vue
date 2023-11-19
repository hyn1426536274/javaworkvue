<template>
  <nav>
    <router-link to="/">主页</router-link> |
    <router-link to="/user">用户</router-link>|
    <router-link to="/admin">管理</router-link>
    
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: 'Avenir', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333; /* 更改为更柔和的文字颜色 */
}

nav {
  padding: 20px; /* 减少上下内边距 */
  background-color: #f8f9fa; /* 添加背景颜色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

nav a {
  font-weight: bold;
  color: #495057; /* 更改链接颜色 */
  text-decoration: none; /* 去掉下划线 */
  margin: 0 10px; /* 添加左右外边距 */
  padding: 8px 12px; /* 添加内边距 */
  border-radius: 4px; /* 圆角边框 */
  transition: background-color 0.3s; /* 添加过渡效果 */
}

nav a:hover {
  background-color: #4ed99a; /* 鼠标悬停时的背景颜色 */
  color: #fff; /* 鼠标悬停时的文字颜色 */
}

nav a.router-link-exact-active {
  background-color: #4ed99a; /* 链接激活时的背景颜色 */
  color: #fff; /* 链接激活时的文字颜色 */
}
</style>
