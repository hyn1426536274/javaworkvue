<!-- ChildComponent.vue -->
<template>
  <div class="article" @click="navigateToArticle">
    <h3 class="title">{{ article.title }}</h3>
    <p>文章类型: <span class="article-type">{{ typeObj? typeObj.name : '无' }}</span></p>
    <p class="description">{{ article.description }}</p>
    <div class="info">
      <p><strong>浏览量:</strong> {{ article.views }}</p>
      <p><strong>创建时间:</strong> {{ formatDate(article.create_time) }}</p>
      <p><strong>最后更新时间:</strong> {{ formatDate(article.update_time) }}</p>
      <p><strong>是否公开:</strong> {{ article.published ? '是' : '否' }}</p>
      <p><strong>作者:</strong> {{ article.username }}</p>
    </div>
    <!-- 其他文章信息 -->
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true; // 允许跨域携带cookie

export default {
  name: 'ArticleOutline',
  props: {
    article: Object, // 假设文章对象的格式是一个对象
    is_self: Boolean,
  },
  data() {
    return {
      searchResult: null,
      error: null,
      typeObj: null,
    };
  },
  async created() {
    if(this.article.type_id){
      await this.getTypeName(this.article.type_id);
    }
  },
  methods: {
    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },
    async getTypeName(type_id){
      try {
        const formData = new FormData();
        formData.append('id', type_id);
        const response = await axios.post('http://localhost:8888/getTypeById', formData, {
          withCredentials: true,
        });
        this.searchResult = response.data;
        console.log("typeObj", this.searchResult.data);
        this.typeObj = this.searchResult.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
        this.searchResult = null;
      }
    },
    navigateToArticle() {
      this.$router.push({
        name: `article`, // query传参
        query: {
          title: this.article.title,
          user_id: this.article.user_id,
          is_self: this.is_self,
        }
      })
    },

  },
};
</script>

<style scoped>
.article {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* 添加鼠标指针样式 */
  transition: box-shadow 0.3s; /* 添加过渡效果 */
}

.article-type {
  background-color:#3ac17a;
  color: #fff;
  font-size: 14px;
  padding: 2px 5px;
  border-radius: 5px
}

.article:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); /* 鼠标悬浮时的阴影效果 */
}

.title {
  color: #333;
}

.description {
  color: #666;
}

.info {
  margin-top: 10px;
}

.info p {
  margin: 5px 0;
  font-size: 14px;
  color: #444;
}

.info strong {
  margin-right: 5px;
  font-weight: bold;
}
</style>
