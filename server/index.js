// 引入 koa
const Koa = require('koa')
// 引入 koa-router
const Router = require('koa-router')
// 引入 koa-bodyparser，用于解析前端提交过来的参数
const bodyParser = require('koa-bodyparser')

// 引入 fs 模块，处理读写文件
const fs = require('fs')

// 引入 chat 模块
const chat = require('./chat')

// 创建 Koa 实例
const app = new Koa()
app.use(bodyParser())

// 创建 Router 实例
const router = new Router({
  prefix: '/apii'
})

router.get('/', async (ctx, next) => {
  console.log('koa...')
  ctx.body = {
    result: 'true',
    intro: 'introduction'
  }
})

// 用户登录服务
router.post('/user/login', async ctx => {
  const name = ctx.request.body.name
  const password = ctx.request.body.password

  console.log(`name: ${name}, password: ${password}.`)

  // 验证用户名，确认用户是否存在：若存在，则验证其密码；若不存在，则直接自动注册
  // 读取json文件并将其转化为js对象
  let userDataJson = JSON.parse(fs.readFileSync('user-data.json'))
  // 将js对象转化为js数组
  let userList = Array.from(userDataJson)

  let currUser
  // 遍历用户数组，验证用户名是否存在
  for (let user of userList) {
    if (user.name === name) {
      // 用户名匹配成功时
      console.log('用户已存在')
      if (user.password === password) {
        console.log('密码正确，登录成功')
        currUser = user

        ctx.body = {
          result: 'true',
          id: currUser.id,
          name: currUser.name,
          password: currUser.password,
          avatar: currUser.avatar
        }
        return
      } else {
        console.log('密码错误，登录失败')
        ctx.body = {
          result: 'false',
          name: name
        }
        return
      }
    }
  }
  // 用户名找不到时
  console.log('用户不存在，需要注册')
  let newUser = {
    id: userList[userList.length - 1].id + 1,
    name: name,
    password: password,
    avatar: `../static/img/avatar${Math.floor(Math.random() * 10 + 1)}.png`
  }
  userList.push(newUser)
  let newUserDataJson = JSON.stringify(userList)
  fs.writeFile('user-data.json', newUserDataJson, function(err) {
    if (err) {
      console.log(err)
    }
  })
  console.log('注册成功，已登录')
  currUser = newUser
  ctx.body = {
    result: 'true',
    id: currUser.id,
    name: currUser.name,
    password: currUser.password,
    avatar: currUser.avatar
  }
})

app.use(router.routes()).use(router.allowedMethods())

const server = require('http').Server(app.callback())

// 调用 chat 模块中的 init 函数
chat.init(server)

// 监听 3000 端口
/* app.listen(3000, () => {
  console.log('success listen to port 3000')
}) */
server.listen(3000, () => {
  console.log('success listen to port 3000')
})
