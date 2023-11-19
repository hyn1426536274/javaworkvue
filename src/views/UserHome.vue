<template>
    <div class="user-home">
      <div v-if="userParams">
        <h3>{{ userParams.user.username }}的个人主页</h3>
  
        <!-- 用户信息板块 -->
        <div class="user-info">
          <p>用户信息:</p>
          <p><strong>用户名:</strong> {{ userParams.user.username }}</p>
          <p><strong>邮箱:</strong> {{ userParams.user.email }}</p>
          <p><strong>简介:</strong> {{ userParams.user.description || 'No Description' }}</p>
        </div>
  
        <!-- 添加博客按钮 -->
        <button v-if="is_self" @click="addBlogPage">添加博客</button>


        <!-- 文章目录菜单 -->
        <div class="article-class-menu">
          <span>文章目录:</span>
          <div class="class-list-container">
            <div v-for="blogClass in classList" :key="blogClass.id" class="class-item">
              <p @click="getBlogByClass(blogClass.id)">{{ blogClass.name }}</p>
            </div>
          </div>
        </div>

        <!-- 文章板块 -->
        <div v-if="blogList" class="article-list">
          <ArticleOutline v-for="article in blogList" :key="article.title" :article="article" :is_self="is_self"></ArticleOutline>
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
        targetUsername: null,
        userParams: null,
        searchResult: null,
        error: null,

        user: null,
        blogList: [],
        classList: [],
        is_self: null,
      };
    },
    async created() {
      this.targetUsername = this.$route.query.username;
      if(this.targetUsername){

        // 有目标访问用户（从用户名点击进入）
        await this.getUserPageParams(this.targetUsername);
        if (this.searchResult.status == 1) {
          // 请求用户数据
          this.userParams = this.searchResult.data;
          this.user = this.userParams.user;
            this.blogList = this.userParams.blogList;
            this.classList = this.userParams.blogClassList;
            console.log("this.classList", this.classList);
            console.log("this.classList type", typeof(this.classList));
            this.is_self = this.userParams._self;
          console.log("this.userParams", this.userParams);
        }
      }
      else{
        // 无目标访问用户（查看自己是否登录，进入自己主页）
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
      async getArticleClassList(username) {
        try {
          const formData = new FormData();
          formData.append('username', username);
  
          const response = await axios.post('http://localhost:8888/user/getUserClasses', formData, {
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
          name: `editblog`,
          query: {
            isEdit: false,
          },
        });
      },
      async getBlogByClass(class_id){
        try{
          const formData = new FormData();
          formData.append('class_id', class_id);
          formData.append('username', this.user.username);
          console.log("formData", class_id, this.user.username);
          const response = await axios.post('http://localhost:8888/user/class', formData, {
            withCredentials: true,
          });
          this.searchResult = response.data;
          console.log("this.ClassBlog", this.searchResult);
          this.blogList = this.searchResult.data;
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      }
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


.article-class-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px; /* 适应你的布局和需求，这里只是一个示例 */
  width: 100%;
}

.class-list-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.class-item {
  width: 20%;
  margin-right: 10px; /* 右侧留出 10px 的空隙 */
  margin-bottom: 10px; /* 底部留出 10px 的空隙 */
  box-sizing: border-box; /* 让边框和填充不会增加元素的宽度 */
}

/* 可以根据需要调整样式，比如添加背景颜色、边框等 */
.class-item p {
  padding: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}
.class-item p:hover {
  color: #3ac17a;
  border: 1px solid #3ac17a;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

</style>
  