// 利用 Map 保存在线用户列表
let onlineUsers = new Map()
// 利用 Map 保存 socket
let socketClients = new Map()

function init(server) {
  const io = require('socket.io').listen(server)

  io.on('connection', socket => {
    console.log('socket.id: ' + socket.id) // 客户端是在 main.js 中就建立了 connection

    // 监听客户端的登录广播
    socket.on('login-request', user => {
      console.log(user)

      onlineUsers.set(user.id, user)
      socketClients.set(user.id, socket)

      // 将接收到的 login 广播发送给所有的客户端
      io.emit('login-response', {
        loginUser: user,
        onlineUserCount: onlineUsers.size
      })
    })

    // 监听客户端的消息广播，并通知其他所有在线用户
    socket.on('groupMessage', message => {
      io.emit('groupMessage', message)
    })

    // 监听客户端的私聊消息广播，并通知相应目标用户
    socket.on('privateMessage', (message, targetUser) => {
      let targetSocket = socketClients.get(targetUser.id)
      // *确保 targetSocket 不是undefined
      if (targetSocket) {
        targetSocket.emit('privateMessage', message)
      }
    })

    // 监听客户端的获取在线用户列表请求
    socket.on('onlineUsers', () => {
      let onlineUserList = Array.from(onlineUsers.values())
      socket.emit('onlineUsers', {
        onlineUsers: onlineUserList
      })
    })

    // 监听客户端退出聊天室事件
    socket.on('disconnect', () => {
      // 获取登出用户的id
      let logoutUserId = -1
      for (let [key, value] of socketClients) {
        if (socket.id === value.id) {
          logoutUserId = key
          break
        }
      }

      let logoutUser = onlineUsers.get(logoutUserId)

      // 在服务器中删除该登出用户的信息
      onlineUsers.delete(logoutUserId)

      // 广播该用户的退出信息
      io.emit('logout', {
        logoutUser: logoutUser,
        onlineUserCount: onlineUsers.size
      })
    })
  })
}

module.exports.init = init
