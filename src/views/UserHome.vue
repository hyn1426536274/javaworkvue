<template>
    <div class="user-home">
      <div v-if="userParams">
        <h3>{{ userParams.user.username }}的个人主页</h3>
  
        <!-- 用户信息板块 -->
        <div class="user-info">
          <h3>用户信息:</h3>
          <p><strong>用户名:</strong> {{ userParams.user.username }}</p>
          <p><strong>邮箱:</strong> {{ userParams.user.email }}</p>
          <p><strong>简介:</strong> {{ userParams.user.description || 'No Description' }}</p>
        </div>
  
        <!-- 添加博客按钮 -->
        <button v-if="is_self" @click="addBlogPage">添加博客</button>
  
        <!-- 文章板块 -->
        <div v-if="userParams.blogList.length > 0" class="article-list">
          <ArticleOutline v-for="article in userParams.blogList" :key="article.title" :article="article" :is_self="is_self"></ArticleOutline>
        </div>
        <div v-else>
          <p>No articles found.</p>
        </div>
      </div>
      <div v-else>
        <p>User not logged in.</p>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
import ArticleOutline from '@/components/ArticleOutline.vue';
  axios.defaults.withCredentials = true; // 允许跨域携带cookie
  
  export default {
    name: 'UserHome',
    components: { ArticleOutline },
    data() {
      return {
        userParams: null,
        searchResult: null,
        error: null,

        user: null,
        blogList: null,
        classList: null,
        is_self: null,
      };
    },
    async created() {
      await this.isLogin();
      console.log("this.serch", this.searchResult);
      if (this.searchResult.status == 1) {
        await this.getUserPageParams(this.searchResult.data.username);
        if (this.searchResult.status == 1) {
          this.userParams = this.searchResult.data;
          this.user = this.userParams.user;
            this.blogList = this.userParams.blogList;
            this.classList = this.userParams.blogClassList;
            this.is_self = this.userParams._self;
          console.log("this.userParams", this.userParams);
        }
      }
    },
    methods: {
      async isLogin() {
        try {
          const response = await axios.post('http://localhost:8888/admin/isLogin', {
            withCredentials: true,
          });
          this.searchResult = response.data;
          console.log("Res", this.searchResult);
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      },
      async getUserPageParams(username) {
        try {
          const formData = new FormData();
          formData.append('username', username);
  
          const response = await axios.post('http://localhost:8888/user', formData, {
            withCredentials: true,
          });
  
          this.searchResult = response.data;
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      },
      addBlogPage(){
        this.$router.push({
          name: `addblog`,

        });
      },
      }
    };
    
    
</script>
  
<style scoped>
.user-home {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fffdfd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 20px;
}

.user-info {
  margin-bottom: 20px;
}

.user-info h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* 调整用户信息板块样式 */
.user-info p {
  margin: 5px 0;
}

/* 调整添加博客按钮样式 */
button {
  margin-bottom: 20px;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fffdfd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;
}
button:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  background-color: #3ac17a;
    color: #fff;
    border: 1px solid #3ac17a;
}

.article-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

p {
  font-size: 16px;
}
</style>
  