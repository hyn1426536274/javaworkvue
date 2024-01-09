<template>
    <div class="article-details" v-if="articleData">
      <h1>{{ articleData.title }}</h1>
  
      <button v-if="is_self" @click="toEditPage" class="edit-button">编辑该博客</button>
  
      <div class="article-info">
        <div class="article-meta">
          <p class="author" @click="toUserPage"><strong>作者:</strong> {{ articleData.username }}</p>
          <p><strong>是否发表:</strong> {{ articleData.published ? 'Yes' : 'No' }}</p>
          <!-- <p><strong>Views:</strong> {{ articleData.views }}</p>
          <p><strong>Comments:</strong> {{ articleData.comment_count }}</p> -->
          <p><strong>文章类型:</strong> {{ typeObj? typeObj.name : '无' }}</p>
          <!-- 其他文章信息 -->
        </div>
        <div class="article-timestamps">
          <p><strong>创建时间:</strong> {{ formatDate(articleData.create_time) }}</p>
          <p><strong>最后更新时间:</strong> {{ formatDate(articleData.update_time) }}</p>
        </div>
      </div>
  
      <div class="article-content" v-if="articleData.content">
        <h3>文章内容:</h3>
        <div class="markdown-content" v-html="compiledMarkdown"></div>
      </div>
  
      <div class="no-content" v-else>
        <p>No content available.</p>
      </div>
  
      <div class="error" v-if="error">
        <p>Error: {{ error }}</p>
      </div>
    </div>

    <div v-if="articleData" class="bottom-bar">
      <p><strong>作者:</strong> {{ articleData.username }}</p>
      <!-- <div id="approval-buttom" class = "bottom-button">
        <p>点赞</p>
      </div> -->
      <!-- <div id="comment-button" class = "bottom-button">
        <p><a href="#write-comment">评论</a></p>
      </div> -->
    </div>

    <div id="write-comment" class="write-comment" >
      <p class="write-comment-p">发表评论</p>
      <div class="comment-input">
        <textarea class="comment-input-textarea" placeholder="请输入评论内容"></textarea>
      </div>
      <div class="comment-submit-button" @click="submitFirstComment">
        发表
      </div>
    </div>


    <div class="comments-board">
      <p class="comments-board-p">评论</p>
      <div v-if="commentsData">
      <!-- 使用组件 -->
      <CommentMessage v-for="comment in commentsData" :key="comment.id" :comment="comment"></CommentMessage>
      </div>
      <div v-else>
        <p>暂无评论</p>
      </div>
    </div>
    
    
  </template>
  
  
  <script>
  import axios from 'axios';
  import {marked} from 'marked';
  import CommentMessage from '@/components/CommentMessage.vue';
  
  export default {
    data() {
      return {
        searchResult: null,
        error: null,
        articleData:null,
        commentsData:null,
        typeObj: null,
        is_self: null,
      };
    },
    async created() {
      await this.getArticleData(); // 等获取到文章数据后再根据用户名和标题获取评论数据
      this.getCommentsData();
    },
    computed: {
      compiledMarkdown() {
        return marked(this.articleData.content, { sanitize: true });
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

          if(this.articleData.type_id){
            await this.getTypeName(this.articleData.type_id);
          }
          
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      },
      async getCommentsData() {
        try {
          const formData = new FormData();
          formData.append('authorname', this.articleData.username);
          formData.append('title', this.$route.query.title);
          
          const response = await axios.post('http://localhost:8888/user/article/getFirstComments', formData, {
            withCredentials: true,
          });
  
          this.searchResult = response.data;
          this.commentsData = this.searchResult.data;
          
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
      },
      async submitFirstComment(){
        try {
          const formData = new FormData();
          formData.append('authorname', this.articleData.username);
          formData.append('title', this.$route.query.title);
          formData.append('content', document.getElementsByClassName("comment-input-textarea")[0].value);
          
          const response = await axios.post('http://localhost:8888/user/article/replyToArticle', formData, {
            withCredentials: true,
          });
  
          this.searchResult = response.data;
          alert(this.searchResult.message);
          
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
    async getTypeName(type_id){
      try {
        const formData = new FormData();
        formData.append('id', type_id);
        const response = await axios.post('http://localhost:8888/getTypeById', formData, {
          withCredentials: true,
        });
        this.searchResult = response.data;
        this.typeObj = this.searchResult.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
        this.searchResult = null;
      }
    },
    toEditPage(){
        //跳转到编辑页面
        this.$router.push({
        name: 'editblog',
        query: {
            articleData: JSON.stringify(this.articleData),
            isEdit: true, // 编辑或新建
            // is_self: this.$route.query.is_self,
        },
        });
    },
    toUserPage(){
        //跳转到用户页面
        this.$router.push({
        name: 'userhome',
        query: {
            username: this.articleData.username,
        },
        });
    }
    },
    components: { CommentMessage }
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
.author{
  cursor: pointer;
  /* 边框 */
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 4px;
  transition: all 0.3s;
}
.author:hover{
  color: #3ac17a;
  border: 1px solid #3ac17a;

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

  /* 底部菜单 */
.bottom-bar {
  position: sticky;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;
  padding: 5px 25%; /* 设置底栏的内边距，根据需要更改 */
  background-color:#fcfcfc; /* 设置底栏背景颜色，根据需要更改 */
  display: flex;
}

.bottom-button {
  display: inline-block;
  line-height: 10px;
  margin: 0 14px;
  padding: 0px 22px;
  cursor: pointer;
  border: 1px solid #ccc; /* 添加边框，根据需要更改 */
  border-radius: 5px; /* 添加圆角，根据需要更改 */
  background-color: #eaeaea; /* 设置按钮背景颜色，根据需要更改 */
  color: #333;
  transition: all 0.3s; 
}

.bottom-button:hover {
  background-color: #3ac17a; /* 设置按钮悬浮时的背景颜色，根据需要更改 */
  color: #fff; /* 设置按钮悬浮时的文字颜色，根据需要更改 */
}


#approval-buttom {
  /* 可以根据需要添加特定的样式 */
}

#comment-button {
  /* 可以根据需要添加特定的样式 */
}

/* 评论区 */
.write-comment {
  position: relative;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 50px;
  box-sizing: border-box;
  padding: 0 25%;
}
.write-comment-p{
  text-align: left;
  margin: 10px;
  font-size: 16px;
}
.comment-input-textarea{
  position: relative;
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 2px;
  outline: none;
  resize: none;
  padding: 10px;
  font-size: 16px;
}
.comment-submit-button{
  position: absolute;
  right: calc(25%);
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fffdfd;
  cursor: pointer;
  transition: all 0.3s;
}
.comment-submit-button:hover{
  background-color: #3ac17a;
  color: #fff;
  border: 1px solid #3ac17a;
}

.comments-board{
  width: 100%;
  margin-top: 20px;
  margin-bottom: 50px;
  box-sizing: border-box;
  padding: 0 25%;
}
.comments-board-p{
  width: 100%;
  box-sizing: border-box;  /* 使得内边距和边框不会撑开容器 */
  text-align: left;
  margin: 10px;
  padding: 5px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #353535;
  border: 1px solid #ccc;
}
</style>