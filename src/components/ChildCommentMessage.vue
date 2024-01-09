
<template>
       <div class="child-comment">
      <div class="comment-head">
        <p>{{ comment.username }}<span style="font-weight: 500;font-size: 14px;">&nbsp;&#62;{{ near_father_name }}</span></p>
        <div class="comment-head-right" @click="replyComment">
          <div class="replyCommentButton">回复</div>
        </div>
        
      </div>
      <div class="comment-content">
        <p>{{ comment.content }}</p>
      </div>
      <div class="comment-bottom">
        <p><strong>评论时间:</strong> {{ formatDate(comment.create_time)}}</p>
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true; // 允许跨域携带cookie

export default {
  name: 'ChildCommentMessage',
  props: {
    comment: Object,  // 文章评论对象(childComment)
  },
  data() {
    return {
      searchResult: null,
      error: null,
      near_father_name: null, // 回复的父评论的用户名
    };
  },
  async created() {
    if(this.comment.near_father_id != 0){
        await this.getNearFatherName(this.comment.near_father_id);
    }

  },
  methods: {
    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },
    async getNearFatherName(father_comment_id){
      try {
        const formData = new FormData();
        formData.append('tar_comment_id', father_comment_id);
        const response = await axios.post('http://localhost:8888/user/article/getCommentById', formData, {
          withCredentials: true,
        });
        this.searchResult = response.data;
        if(this.searchResult.status==1){
            this.near_father_name = this.searchResult.data.username;
        }
        this.error = null;
      } catch (error) {
        this.error = error.message;
        this.searchResult = null;
      }
    },
    async replyComment(){
      try {
          var content = window.prompt("请输入回复内容");
          if(content == null){
              //alert("取消回复");
              return;
          }
          const formData = new FormData();
          formData.append('tar_blog_id', this.comment.blog_id);
          formData.append('near_father_id', this.comment.id);
          formData.append('content', content);
          
          
          const response = await axios.post('http://localhost:8888/user/article/replyToComment', formData, {
            withCredentials: true,
          });
  
          this.searchResult = response.data;
          alert(this.searchResult.message);
          this.error = null;
        } catch (error) {
          this.error = error.message;
          this.searchResult = null;
        }
    }
  },
};
</script>
<style scoped>
/* 在你的样式文件中添加以下CSS样式，或者直接在Vue组件中使用<style>标签 */
.child-comment {
  width: 100%;
  box-sizing: border-box;
  margin: 10px;
  padding: 10px;
  border: 1px solid #cacaca;
  border-radius: 2px;
  background-color: #f2f2f2;
}

.comment-head {
  display: flex;
  justify-content: space-between; /* 将子元素分别放在弹性容器的两侧 */
  width: 100%;
  box-sizing: border-box;
}

.comment-head p {
  margin: 0;
  margin-left: 10px;
  display: inline;
  font-size: 16px;
  float: left;
  font-weight: bold;
}


.comment-content p {
  padding-left: 20px;
  font-size: 14px;
  text-align: left; /* 左对齐 */
}


.comment-bottom p {
  margin: 0;
  font-size: 12px;
  text-align: right; /* 右对齐 */
}
.replyCommentButton {
    padding: 1px 10px;
    color: #41BC83;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.3s;
}
.replyCommentButton:hover {
    background-color: #41BC83;
    color: #ffffff;
}

</style>