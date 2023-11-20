<template>
  <div class="loading" v-if="onLoading">正在处理……</div>
  <div class="registration-form">
    <h3>REGISTER</h3>
    <!-- 表单元素 -->
    <form v-if="!isSended" @submit.prevent="sendRegisterEmail">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" placeholder="username">
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="text" id="email" v-model="email" placeholder="email">
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" placeholder="password">
      </div>
      <div class="form-group">
        <label for="password2">确认密码:</label>
        <input type="password" id="password2" v-model="password2" placeholder="Confirm your password">
      </div>
      <button type="submit">发送邮箱验证码</button>
    </form>

    <form v-if="isSended" @submit.prevent="VertifyCode">
      <div class="form-group">
        <label for="code">填写验证码：</label>
        <input type="text" id="code" v-model="code" placeholder="Enter your verification code">
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserRegister',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        password2: '',
        code: '',
        isSended: null,
        searchResult: null,
        error: null,
        onLoading: false,
      };
    },
    methods: {
      async sendRegisterEmail() {
        try {
          // 创建 FormData 对象，用于存储表单数据
            const formData = new FormData();
            formData.append('username', this.username);
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('password2', this.password2);

            // console.log("FormData: ",formData);
          // 发送 POST 请求
          // 携带cookie
          this.onLoading = true;
          const response = await axios.post('http://localhost:8888/admin/register', formData, {
            withCredentials: true,});
          this.onLoading = false;
          // 处理成功响应
          this.searchResult = response.data;
          alert(this.searchResult.message);
          this.isSended = this.searchResult.status;
          this.error = null;
        } catch (error) {
          // 处理错误
          this.error = error.message;
          alert(this.error);
          this.searchResult = null;
        }
      },
      async VertifyCode() {
        try {
          // 创建 FormData 对象，用于存储表单数据
          const formData = new FormData();
          formData.append('code', this.code);
          formData.append('email', this.email);
          
            console.log("FormData: ", formData);
          // 发送 POST 请求
          // withCredentials: true, 携带cookie 【否则属于不同会话，后端session无法验证】
          const response = await axios.post('http://localhost:8888/admin/verifyCode', formData, {
            withCredentials: true,});
  
          // 处理成功响应
          this.searchResult = response.data;
          alert(this.searchResult.message);
          if(this.searchResult.status == 1){
            this.$router.push({
              name:`login`,
            });
          }
          this.error = null;
        } catch (error) {
          // 处理错误
          this.error = error.message;
          alert(this.error);
          this.searchResult = null;
        }
      }
    }
  };
  </script>
<style scoped>
.registration-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fffdfd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;

}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 16px;
  margin-bottom: 5px;
  display: inline-block; /* 让标签元素变为块级元素，实现左对齐效果 */
  float: left;
}

input {
  position: relative;
  right: 0;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 5px;
  height: 20px;
  /* 对齐 */
  float: right;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 背景颜色 */
  background-color: rgba(0, 0, 0, 0.3);
  /* 垂直水平居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 字体颜色 */
  color: #fff;
  font-size: 20px;
  z-index: 999;
}

button {
  padding: 10px;
  font-size: 18px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}
</style>