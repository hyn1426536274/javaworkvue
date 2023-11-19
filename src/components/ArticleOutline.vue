<!-- ChildComponent.vue -->
<template>
  <div class="article" @click="navigateToArticle">
    <h3 class="title">{{ article.title }}</h3>
    <p class="description">{{ article.description }}</p>
    <div class="info">
      <p><strong>创建时间:</strong> {{ formatDate(article.create_time) }}</p>
      <p><strong>最后更新时间:</strong> {{ formatDate(article.update_time) }}</p>
      <p><strong>是否公开:</strong> {{ article.published ? '是' : '否' }}</p>
      <p><strong>作者:</strong> {{ article.username }}</p>
    </div>
    <!-- 其他文章信息 -->
  </div>
</template>

<script>
export default {
  name: 'ArticleOutline',
  props: {
    article: Object, // 假设文章对象的格式是一个对象
    is_self: Boolean,
  },
  methods: {
    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
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
