<template>
    <nav>
    <router-link :to="{name:'login'}">登录</router-link>
    |<router-link :to="{name:'register'}">注册</router-link>
  </nav>
  <router-view/>
</template>
<style scoped>

</style>