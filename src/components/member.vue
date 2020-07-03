<template>
  <div class="member">
    <div class="header">
      <div @click="back()" class="header-left">
        <span class="fa fa-angle-left"></span>
      </div>
      <div class="header-title"></div>
      <div class="header-right"></div>
    </div>

    <div class="member-content">
      <div :key="index" class="member-item" v-for="(user,index) in onlineUserList">
        <!-- v-if 渲染的是"他人的头像"，用于开启私聊窗口 -->
        <div class="icon" v-if="user.id !== userId">
          <router-link :to="{path:'home', query:{targetUser: user}}">
            <img :src="user.avatar" alt />
          </router-link>
        </div>
        <!-- v-else 渲染的是"自己的头像"，用于更换个人头像(暂未实现) -->
        <div class="icon" v-else>
          <img :src="user.avatar" alt />
        </div>
        <h2>{{user.name}}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'member.vue',
  data: function() {
    return {
      onlineUserList: [],
      userId: ''
    }
  },
  methods: {
    back: function() {
      this.$router.go(-1) // 跳转至上一页面
    },
    init: function() {
      // 向服务器端发送获取在线用户列表请求
      this.$io.emit('onlineUsers')

      this.$io.on('onlineUsers', data => {
        this.onlineUserList = data.onlineUsers
      })
    }
  },
  created: function() {
    this.init()
    this.userId = sessionStorage.getItem('userId')
  }
}
</script>

<style scoped>
.member {
  width: 100%;
  height: 100%;
  background: #2bb0b2;
}

.member .header {
  width: 100%;
  height: 44px;
  line-height: 44px;
  color: #fff;
  display: flex;
  font-size: 18px;
  background: #0c9198;
  margin-bottom: 10px;
  justify-content: space-between;
}

.member .header .header-left,
.member .header .header-right {
  width: 20px;
  text-align: center;
}

.member-content {
  width: 90%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
}

.member-content .member-item {
  margin: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.member-content .member-item .icon {
  width: 50px;
  height: 50px;
}

.member-content .member-item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.member-content .member-item h2 {
  font-size: 12px;
  color: #fff;
}
</style>
