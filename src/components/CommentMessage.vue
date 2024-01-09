
<template>
    <div class="comment">
      <div class="comment-head">
        <p>{{ comment.username }}</p>
        <div class="comment-head-right">
          <div class="replyCommentButton" @click="replyComment">回复</div>
        </div>
        
      </div>
      <div class="comment-content">
        <p>{{ comment.content }}</p>
      </div>
      <div class="comment-bottom">
        <p><strong>评论时间:</strong> {{ formatDate(comment.create_time) }}</p>
      </div>
    </div>

    <div class="childCommentsArea" v-if="childComments">
        <div v-for="childComment in childComments" :key="childComment.id">
            <ChildCommentMessage :comment="childComment"/>
        </div>
    </div>
  </template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true; // 允许跨域携带cookie
import ChildCommentMessage from '@/components/ChildCommentMessage.vue';

export default {
  name: 'CommentMessage',
  props: {
    comment: Object,  // 文章评论对象
  },
  data() {
    return {
      searchResult: null,
      error: null,
      childComments: null,
    };
  },
  async created() {
    await this.getAllChildComments();
  },
  methods: {
    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    },
    async getAllChildComments(){
      try {
        const formData = new FormData();
        formData.append('first_father_id', this.comment.id);
        const response = await axios.post('http://localhost:8888/user/article/getChildComments', formData, {
          withCredentials: true,
        });
        this.searchResult = response.data;
        this.childComments = this.searchResult.data;
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
              //alert("取消回复"); // 否则点击取消后content为null字符串
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
  components: { ChildCommentMessage }
};
</script>
<style scoped>
/* 在你的样式文件中添加以下CSS样式，或者直接在Vue组件中使用<style>标签 */
.comment {
  width: 100%;
  box-sizing: border-box;
  margin: 10px;
  padding: 10px;
  border: 1px solid #909090;
  border-radius: 2px;
  background-color: #ffffff;
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

.childCommentsArea {

    margin-left: 7%;
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