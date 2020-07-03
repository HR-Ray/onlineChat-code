<template>
  <div class="login">
    <div class="prompt-err" v-if="errInfo !== ''">
      <span>{{errInfo}}</span>
    </div>
    <div class="logo">
      <img alt src="../assets/images/logo.png" />
      <h2>实训在线-聊天室</h2>
    </div>

    <form @submit.prevent="_onSubmitUserLogin" action="#" method="post">
      <div class="login-input">
        <span class="fa fa-user"></span>
        <input placeholder="请输入用户名..." required type="text" v-model="user.name" />
      </div>
      <div class="login-input">
        <span class="fa fa-lock"></span>
        <input placeholder="请输入密码..." required type="password" v-model="user.password" />
      </div>
      <div class="login-button">
        <input type="submit" value="登录/注册" />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login.vue',
  data: function() {
    return {
      user: {
        name: '',
        password: ''
      },
      errInfo: ''
    }
  },
  methods: {
    _onSubmitUserLogin: function() {
      // console.log(this.user.name)
      // console.log(this.user.password)

      let _this = this

      // 验证用户名不能为空
      let name = this.user.name.trim()
      if (name.length === 0) {
        this.errInfo = '用户名称不允许为空！'
        // 2s后自动清除错误提示信息
        setTimeout(function() {
          _this.errInfo = ''
        }, 2000)
        return
      }
      // 验证密码不能为空且长度在6-10个字符之间
      let password = this.user.password.trim()
      if (password.length === 0) {
        this.errInfo = '密码不允许为空！'
        // 2s后自动清除错误提示信息
        setTimeout(function() {
          _this.errInfo = ''
        }, 2000)
        return
      }
      if (password.length < 6 || password.length > 10) {
        this.errInfo = '密码必须在6-10个字符之间！'
        // 2s后自动清除错误提示信息
        setTimeout(function() {
          _this.errInfo = ''
        }, 2000)
        return
      }

      // 通过http协议将信息提交到后端
      this.$http
        .post('api/user/login', {
          name: this.user.name,
          password: this.user.password
        })
        .then(res => {
          console.log(res)
          if (res.data.result === 'true') {
            // 登录成功，保存当前用户id至sessionStorage，再跳转页面
            this.saveUserIdToSession(res)
            this.$router.push({
              path: '/home'
            })
          } else {
            _this.errInfo = '密码有误，请重新输入密码'
            setTimeout(function() {
              _this.errInfo = ''
            }, 2000)
          }
        })
    },
    saveUserIdToSession: function(res) {
      sessionStorage.setItem('userId', res.data.id)
      sessionStorage.setItem('userName', res.data.name)
      sessionStorage.setItem('userAvatar', res.data.avatar)
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: #2bb0b2;
}

.login .logo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login .logo img {
  width: 30%;
  margin-top: 80px;
}

.login .logo h2 {
  color: #fff;
  margin: 40px auto;
}

.login form {
  width: 90%;
  margin: auto;
  background: rgba(29, 146, 125, 0.4);
  border-radius: 5px;
  padding: 5px 0 30px;
}

.login form .login-input {
  width: 90%;
  margin: 30px auto;
  height: 40px;
  line-height: 40px;
  background: #f7feef;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.login form .login-input span {
  color: #97c4b8;
  padding: 0 10px;
  font-size: 18px;
}

.login form .login-input input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: none;
  border: none;
  padding: 0 5px;
}

input::placeholder {
  color: #97c4b8;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.login form .login-button {
  width: 50%;
  margin: auto;
  height: 40px;
  line-height: 40px;
  background: #0c9198;
  border-radius: 5px;
}

.login form .login-button input {
  color: #fff;
  font-size: 16px;
  width: 100%;
  text-align: center;
  background: none;
  border: none;
}

.prompt-err {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.prompt-err span {
  padding: 10px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.4);
  margin-top: 20px;
}
</style>
