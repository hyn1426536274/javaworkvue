<template>
    <div class="article-details" v-if="articleData">
      <h1>{{ articleData.title }}</h1>
  
      <button v-if="is_self" @click="toEditPage" class="edit-button">编辑该博客</button>
  
      <div class="article-info">
        <div class="article-meta">
          <p><strong>作者:</strong> {{ articleData.username }}</p>
          <p><strong>是否发表:</strong> {{ articleData.published ? 'Yes' : 'No' }}</p>
          <!-- <p><strong>Views:</strong> {{ articleData.views }}</p>
          <p><strong>Comments:</strong> {{ articleData.comment_count }}</p> -->
          <p><strong>文章类型:</strong> {{ articleData.type_id }}</p>
          <!-- 其他文章信息 -->
        </div>
        <div class="article-timestamps">
          <p><strong>创建时间:</strong> {{ formatDate(articleData.create_time) }}</p>
          <p><strong>最后更新时间:</strong> {{ formatDate(articleData.update_time) }}</p>
        </div>
      </div>
  
      <div class="article-content" v-if="articleData.content">
        <h2>文章内容:</h2>
        <div class="markdown-content" v-html="compiledMarkdown"></div>
      </div>
  
      <div class="no-content" v-else>
        <p>No content available.</p>
      </div>
  
      <div class="error" v-if="error">
        <p>Error: {{ error }}</p>
      </div>
    </div>
  </template>
  
  
  <script>
  import axios from 'axios';
  import {marked} from 'marked';
  
  export default {
    data() {
      return {
        searchResult: null,
        error: null,
        articleData:null,
        is_self: null,
      };
    },
    created() {
      this.getArticleData();
    },
    computed: {
    compiledMarkdown() {
      return marked.parse(this.articleData.content);
    },
  },
    methods: {
      async getArticleData() {
        try {
          const formData = new FormData();
          formData.append('user_id', this.$route.query.user_id);
          formData.append('title', this.$route.query.title);
          
          

          const response = await axios.post('http://localhost:8888/user/article', formData, {
            withCredentials: true,
          });
  
          this.searchResult = response.data;
          this.articleData = this.searchResult.data;
          // 传输过来的是字符串，即使是false字符串在v-if中也会被当作true
          
          this.is_self = JSON.parse(this.$route.query.is_self);
            // console.log("this.is_self", typeof(this.is_self), this.is_self);
            // console.log("this.$route.query.is_self", typeof(this.$route.query.is_self), this.$route.query.is_self);
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      },
    formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
    },

    toEditPage(){
        //跳转到编辑页面
        this.$router.push({
        name: 'editblog',
        query: {
            articleData: JSON.stringify(this.articleData),
            // is_self: this.$route.query.is_self,
        },
        });
    }
    },
  };
  </script>
  <style scoped>
  .article-details {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  h1 {
    color: #333;
  }

  /* .edit-button {
    background-color: #4caf50;
    color: #fff;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  } */
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
  .article-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    background-color: #f7f7f7;
    padding: 10px;
    border-radius: 4px;

  }

  .article-meta,
  .article-timestamps {
    width: 48%;
  }

  .article-meta p,
  .article-timestamps p {
    margin: 8px 0;
  }

  .article-content {
    margin-top: 20px;
  }

  .markdown-content {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
  }

  .no-content,
  .error {
    margin-top: 20px;
    color: #d9534f;
  }
</style>