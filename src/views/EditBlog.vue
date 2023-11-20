<template>
    <div class="editblog-contain">
        <h2 v-if="isEdit">编辑博客</h2>
        <h2 v-else>添加新博客</h2>
      <form> <!-- @submit.prevent="submitForm" -->
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
          <label for="type_id">选择文章类型：</label>
          <select type="number" id="type_id" v-model="blog.type_id">
            <option value="0">无</option>
          </select>
        </div>
        <div>
          <label for="class_id">添加到目录
            <div class="class-button">
              <strong class="add_class" @click="addClass">新建目录</strong>
              <strong class="delete_class" @click="deleteClass">删除目录</strong>
            </div>
          </label>

          <select type="number" id="class_id" v-model="blog.class_id">
            <option value="0">无</option>
          </select>
        </div>
        <div class="button-contain">
          <button class="submit" type="submit" @click="submitForm">提交</button>
          <button class="delete" v-if="isEdit" type="submit" @click="deleteBlog">删除此博客</button>
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
        isEdit: null,
        origin_title: "",
        compiledMarkdown: "", // Added to store compiled Markdown

        searchResult: null, // 要初始化传值
        error: null,

        typeList: null,
        classList: null,
      };
    },
    async created() {
      await this.getBlogData();
      await this.getTypeListData();
      await this.getClassListData();
      this.updateMarkdownPreview();
    },
    methods: {
      async getBlogData(){
            this.isEdit = JSON.parse(this.$route.query.isEdit);

            if(this.$route.query.articleData){
               this.blog = JSON.parse(this.$route.query.articleData);
            }
            // 保存原始标题,用于修改标题后能找到更新对象
            this.origin_title = this.blog.title; 
        },
      async getTypeListData(){
        try {
            const formData = new FormData();

            const response = await axios.post('http://localhost:8888/getAllType', formData, {
              withCredentials: true,
            });
            
            this.searchResult = response.data;
            this.error = null;

            this.typeList = this.searchResult.data;
            /* 添加到type_id下拉列表 */
            var select = document.getElementById("type_id");
            for(var i=0; i<this.typeList.length; i++){
              var option = document.createElement("option");
              option.value = this.typeList[i].id;
              option.text = this.typeList[i].name;
              select.appendChild(option);
            }

            
          }
          catch (error) {
            // 处理错误
            this.error = error.message;
            this.searchResult = null;
          }
      },
      async getClassListData(){
        try {
            const formData = new FormData();

            const response = await axios.post('http://localhost:8888/user/getClasses', formData, {
              withCredentials: true,
            });
            
            this.searchResult = response.data;
            this.error = null;

            this.classList = this.searchResult.data;
            /* 添加到class_id下拉列表 */
            var select = document.getElementById("class_id");
            for(var i=0; i<this.classList.length; i++){
              var option = document.createElement("option");
              option.value = this.classList[i].id;
              option.text = this.classList[i].name;
              select.appendChild(option);
            }

          }
          catch (error) {
            // 处理错误
            this.error = error.message;
            this.searchResult = null;
          }
      },
      async submitForm() {
        if(this.isEdit){
          await this.submitForm_edit();
        }
        else{
          await this.submitForm_add();
        }
      },
      async submitForm_edit(){
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
      async submitForm_add() {
        // Handle form submission logic here
        // You can send the `blog` data to your backend API to add a new blog
        console.log(this.blog);
        try {
            const formData = new FormData();
            formData.append('title', this.blog.title);
            formData.append('content', this.blog.content);
            formData.append('description', this.blog.description);
            formData.append('published', this.blog.published);
            formData.append('type_id', this.blog.type_id);
            formData.append('class_id', this.blog.class_id);


                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/user/blog/addBlog', formData, {
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
      async deleteBlog(){
        var confirm =  window.confirm("确定删除此博客？");
        if(confirm){
          try {
            const formData = new FormData();
            formData.append('title', this.blog.title);

                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/user/blog/deleteBlog', formData, {
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
        }
        else{
          alert("取消删除");
        }
      },
      async addClass(){
        try{
          var name = window.prompt("添加目录名：");

          if(name != null){
            const formData = new FormData();
          formData.append('name', name);

          // 发送 POST 请求
          const response = await axios.post('http://localhost:8888/user/addClass', formData, {
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                alert(this.searchResult.message);
                this.error = null;
          }
        }
        catch (error) {
                // 处理错误
                this.error = error.message;
                alert(this.error);
                this.searchResult = null;
            }
      },
      async deleteClass(){
        try{
          var name = window.prompt("删除目录名：");

          if(name != null){
            const formData = new FormData();
          formData.append('name', name);

          // 发送 POST 请求
          const response = await axios.post('http://localhost:8888/user/deleteClass', formData, {
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                alert(this.searchResult.message);
                this.error = null;
          }
          
        }
        catch (error) {
                // 处理错误
                this.error = error.message;
                alert(this.error);
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
    margin-top: 2px;
    font-weight: bold;
  }
  
  input,
  textarea,
  button {
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  select {
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  textarea {
    resize: vertical;
  }
  
  .button-contain {
    display: flex;
    justify-content: space-between;
  }
  .submit {
    margin: 20px;
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }
  .submit:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #009445;
  }
  .delete {
    margin: 20px;
    background-color: #f44336;
    color: #fff;
    cursor: pointer;
  }
  .delete:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #d32f2f;
  }

  
  .preview-section {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  /* 小按钮 */
  .class-button{
    display: inline-flex;
    justify-content: space-between;
    padding: 0;
  }
  .add_class{
    margin: 0 20px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #4caf50;
    cursor: pointer;
    transition: all 0.2s;
  }
  .add_class:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    color: #009445;
  }
  .delete_class {
    margin: 0 20px;
    padding: 2px 4px;
    border-radius: 4px;
    color: #f44336;
    cursor: pointer;
    transition: all 0.2s;
  }
  .delete_class:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    color: #d32f2f;
  }
  </style>