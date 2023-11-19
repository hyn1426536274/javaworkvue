<template>
  <div class="home">
    <!-- 表单元素 -->
    <form @submit.prevent="searchByTitle" class="search-form">
      <label for="title">搜索文章</label>
      <input type="text" id="title" v-model="title" placeholder="输入文章标题">
      <button type="submit">搜索</button>
    </form>
  
    <!-- 显示响应结果的区域 -->
    <div v-if="searchResult" class="search-result">
      <h2>搜索结果:</h2>
      
      <!-- 使用组件 -->
      <ArticleOutline v-for="article in searchResult.data" :key="article.title" :article="article"></ArticleOutline>
    </div>
    
    <!-- 显示错误的区域 -->
    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ArticleOutline from '@/components/ArticleOutline.vue';

export default {
    name: 'HomeView',
    data() {
        return {
            title: '',
            searchResult: null,
            error: null
        };
    },
    methods: {
        async searchByTitle() {
            try {
                // 创建 FormData 对象，用于存储表单数据
                const formData = new FormData();
                formData.append('title', this.title);
                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/index/search', formData);
                // 处理成功响应
                this.searchResult = response.data;
                this.error = null;
            }
            catch (error) {
                // 处理错误
                this.error = error.message;
                this.searchResult = null;
            }
        }
    },
    components: { ArticleOutline }
};
</script>
<style scoped>
.home {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fffdfd;
}
.search-form {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center; /* 在主轴上居中对齐 */
}

.search-form label {
  margin-right: 10px;
  font-weight: bold;
}

input[type="text"] {
  margin: 0 12px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

button {
  padding: 6px 15px;
  background-color:  #4ed99a;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #3ac17a;
}

/* 添加一个外部容器，使内容垂直居中 */
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-result {
  margin-top: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}

/* 其他样式保持不变 */
</style>