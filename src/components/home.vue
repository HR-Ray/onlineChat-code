<template>
  <div class="home">
    <!-- 聊天顶部区 -->
    <div class="header">
      <div class="header-left"></div>
      <div class="header-title">
        <router-link to="./member">实训在线({{onlineUserCount}}人)</router-link>
      </div>
      <div class="header-right"></div>
    </div>

    <!-- 聊天内容区 -->
    <div class="home-wrapper">
      <!-- 在v-for中的元素上绑定 key 有助于保持结点的更新 -->
      <!-- 渲染群聊消息 -->
      <div class="home-content" v-bind:key="index" v-for="(item,index) in groupMessageList">
        <!-- left 显示接收的消息 -->
        <div class="left" v-if="item.user.id !==currUser.id">
          <div class="avatar">
            <img :src="item.user.avatar" alt />
            <h2>{{item.user.name}}</h2>
          </div>
          <div class="text">
            <span v-html="item.message"></span>
          </div>
        </div>
        <!-- right 显示发送的消息 -->
        <div class="right" v-else>
          <div class="text">
            <span v-html="item.message"></span>
          </div>
          <div class="avatar">
            <img :src="item.user.avatar" alt />
            <h2>{{item.user.name}}</h2>
          </div>
        </div>
      </div>

      <!-- 渲染私聊消息 -->
      <div class="home-content" v-bind:key="index" v-for="(item,index) in privateMessageList">
        <!-- left 显示接收的消息 -->
        <div class="left" v-if="item.user.id !==currUser.id">
          <div class="avatar">
            <img :src="item.user.avatar" alt />
            <h2>{{item.user.name}}</h2>
          </div>
          <div class="text">
            <span>
              <i>[私聊消息]</i>
              {{item.message}}
            </span>
          </div>
        </div>
        <!-- right 显示发送的消息 -->
        <div class="right" v-else>
          <div class="text">
            <span>
              <i>[发给：{{targetUser.name}}]</i>
              {{item.message}}
            </span>
          </div>
          <div class="avatar">
            <img :src="item.user.avatar" alt />
            <h2>{{item.user.name}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="prompt" v-if="prompt!==''">
      <span>{{prompt}}</span>
    </div>

    <!-- 聊天输入区 -->
    <div class="footer">
      <div class="message-input">
        <input @keyup.enter="sendMessage()" placeholder="请输入消息..." type="text" v-model="message" />
        <button @click="sendMessage()">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home.vue',
  data: function() {
    return {
      currUser: {
        id: '',
        name: '',
        avatar: ''
      },
      targetUser: {
        id: '',
        name: '',
        avatar: ''
      },
      privateChat: false,
      prompt: '',
      message: '',
      groupMessageList: [],
      privateMessageList: [],
      onlineUserCount: 0
    }
  },
  methods: {
    connectEvent: function() {
      // 向服务器端发送登录广播
      this.$io.emit('login-request', this.currUser)

      this.$io.on('login-response', data => {
        // console.log('服务器广播来了...')
        let loginUserName = data.loginUser.name
        this.prompt = `${loginUserName}进入了聊天室！`
        setTimeout(() => {
          this.prompt = ''
        }, 2000)

        this.onlineUserCount = data.onlineUserCount
      })

      // 接收群聊消息
      this.$io.on('groupMessage', data => {
        if (data.user.id !== this.currUser.id) {
          this.groupMessageList.push(data)
        }
      })

      // 接收私聊消息
      this.$io.on('privateMessage', data => {
        this.privateMessageList.push(data)
      })

      // 接收其他用户退出聊天室的广播
      this.$io.on('logout', data => {
        let logoutUserName = data.logoutUser.name
        this.prompt = `${logoutUserName}退出了聊天室！`
        setTimeout(() => {
          this.prompt = ''
        }, 2000)

        this.onlineUserCount = data.onlineUserCount
      })
    },
    sendMessage: function() {
      let messageContent = {
        user: this.currUser,
        message: this.message
      }

      if (this.privateChat) {
        this.privateMessageList.push(messageContent)
        this.$io.emit('privateMessage', messageContent, this.targetUser)
      } else {
        this.groupMessageList.push(messageContent)
        this.$io.emit('groupMessage', messageContent)
      }

      this.message = ''
    },
    // 页面消息列表过长时总是显示在底部
    scrollToBottom: function() {
      // nextTick：等待DOM更新完成后再执行回调函数
      this.$nextTick(() => {
        let container = this.$el.querySelector('.home-wrapper')
        container.scrollTop = container.scrollHeight // 将页面卷到底部
      })
    }
  },
  created: function() {
    // 从 sessionStorage 中读取用户信息
    this.currUser.id = sessionStorage.getItem('userId')
    this.currUser.name = sessionStorage.getItem('userName')
    this.currUser.avatar = sessionStorage.getItem('userAvatar')

    // 判断是否是私聊
    if (this.$route.query.targetUser) {
      this.privateChat = true
      this.targetUser.id = this.$route.query.targetUser.id
      this.targetUser.name = this.$route.query.targetUser.name
      this.targetUser.avatar = this.$route.query.targetUser.avatar
    }

    this.connectEvent()
  },
  /* updated() {
    this.scrollToBottom()
  }, */
  watch: {
    // 如果 groupMessageList 或 privateMessageList 发生改变，这个函数就会运行
    groupMessageList: function() {
      this.scrollToBottom()
    },
    privateMessageList: function() {
      this.scrollToBottom()
    }
  }
}
</script>

<style scoped>
@import '../assets/style/home.css';
</style>
