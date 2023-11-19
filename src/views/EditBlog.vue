<template>
    <div class="editblog-contain">
        <h2>编辑博客</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="title">标题：</label>
          <input type="text" id="title" v-model="blog.title" required>
        </div>
        <div>
          <label for="content">内容：</label>
          <textarea id="content" v-model="blog.content" @input="updateMarkdownPreview" required></textarea>
        </div>
        <div>
          <label for="description">描述：</label>
          <textarea id="description" v-model="blog.description"></textarea>
        </div>
        <div>
          <label for="published">所有人可见：</label>
          <input type="checkbox" id="published" v-model="blog.published">
        </div>
        <div>
          <label for="type_id">类型 ID：</label>
          <input type="number" id="type_id" v-model="blog.type_id">
        </div>
        <div>
          <label for="class_id">分类 ID：</label>
          <input type="number" id="class_id" v-model="blog.class_id">
        </div>
        <div>
          <button type="submit">提交</button>
        </div>
      </form>
      <div v-if="blog.content">
        <h3>MarkDown预览:</h3>
        <div v-html="compiledMarkdown"></div>
      </div>
    </div>
  </template>
  
  <script>
  import {marked} from "marked";
  import axios from "axios";
  axios.defaults.withCredentials = true; // 允许跨域携带cookie

 

  export default {
    data() {
      return {
        blog: {
          title: "",
          content: "",
          description: "",
          published: false,
          type_id: 0,
          class_id: 0,
        },
        origin_title: "",
        compiledMarkdown: "", // Added to store compiled Markdown

        searchResult: null, // 要初始化传值
        error: null,
      };
    },
    async created() {
      await this.getBlogData();
        this.updateMarkdownPreview();
    },
    methods: {
        async getBlogData(){
            console.log("articleData",this.$route.query.articleData);
            this.blog = JSON.parse(this.$route.query.articleData);
            // 保存原始标题,用于修改标题后能找到更新对象
            this.origin_title = this.blog.title; 
            console.log("this.blog",this.blog);
        },
      async submitForm() {
        // Handle form submission logic here
        // You can send the `blog` data to your backend API to add a new blog
        console.log(this.blog);
        try {
            const formData = new FormData();
            formData.append('origin_title', this.origin_title);
            formData.append('title', this.blog.title);
            formData.append('content', this.blog.content);
            formData.append('description', this.blog.description);
            formData.append('published', this.blog.published);
            formData.append('type_id', this.blog.type_id);
            formData.append('class_id', this.blog.class_id);


                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/user/blog/updateBlog', formData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                alert(this.searchResult.message);
                this.error = null;
            }
            catch (error) {
                // 处理错误
                this.error = error.message;
                this.searchResult = null;
            }
      },
      updateMarkdownPreview() {
        this.compiledMarkdown = marked(this.blog.content);
      },
    },
  };
  </script>
  
  <style scoped>
  .editblog-contain {
  
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  
  .blog-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }
  
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  input,
  textarea,
  button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  textarea {
    resize: vertical;
  }
  
  button {
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;
  }
  
  .preview-section {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>