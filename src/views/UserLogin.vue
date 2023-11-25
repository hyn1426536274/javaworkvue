<template>
    <div v-if="hasLogin" class="login-container">
      <h3>LOGIN_OUT</h3>
      <form @submit.prevent="loginOut">
        <div class="form-group">
          <strong>当前用户：{{ current_user.username }}</strong>
        </div>
        <button type="submit">退出登录</button>
      </form>
    </div>
    <div v-else class="login-container">
      <h3>LOGIN</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input id="username" v-model="username" type="text" placeholder="Enter your username">
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input id="password" v-model="password" type="password" placeholder="Enter your password">
        </div>
        <button type="submit">登录</button>
      </form>
    </div>

  </template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true; // 允许跨域携带cookie

export default {
    name: 'UserLogin',
    data() {
        return {
            username: '',
            password: '',
            searchResult: null, // 要初始化传值，不然有问题
            error: null,
            hasLogin: false,
            current_user: null,
        }
    },
    created() {
        this.isLogin();
    },
    methods: {
        async submitForm() {
            // 提交表单的逻辑
            try {
                // 创建 FormData 对象，用于存储表单数据
                const formData = new FormData();
                formData.append('username', this.username);
                formData.append('password', this.password);

                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/admin/login', formData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                window.alert(this.searchResult.message);
                if(this.searchResult.status == 1){
                    this.$router.push({
                        // 如果想用query传递对象，需要用JSON.stringify()转换为字符串，再用JSON.parse()转换为对象
                        name:`userhome`,
                        // query:{ 
                        //     user:JSON.stringify(this.searchResult.data),
                        // }
                    });
                }
                this.error = null;

            } catch (error) {
                // 处理错误
                this.error = error.message;
                this.searchResult = null;
            }
        },
        async isLogin() {
            // 提交表单的逻辑
            try {
                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/admin/isLogin', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                if(this.searchResult.status == 1){
                    this.hasLogin = true;
                    this.current_user = this.searchResult.data;
                }
                this.error = null;

            } catch (error) {
                // 处理错误
                this.error = error.message;
                this.searchResult = null;
            }
        },
        async loginOut(){
            // 提交表单的逻辑
            try {
                // 发送 POST 请求
                const response = await axios.post('http://localhost:8888/admin/loginOut', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,}); 

                // 处理成功响应
                this.searchResult = response.data;
                window.alert(this.searchResult.message);
                if(this.searchResult.status == 1){
                    this.hasLogin = false;
                    this.current_user = null;
                }
                this.error = null;

            } catch (error) {
                // 处理错误
                this.error = error.message;
                this.searchResult = null;
            }
        }
    }

}
</script>

<style scoped>
.login-container {
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