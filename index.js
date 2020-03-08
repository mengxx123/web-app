const { App, Router } = require('./src')
// const { Router } = require('./src/router')

const app = new App()

const router = new Router()

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h5>Index</h5>';
})

router.get('/about', async (ctx, next) => {
    ctx.response.body = '<h5>about</h5>';
})

let users = [
    {
        id: '1',
        name: 'Alice',
    },
    {
        id: '2',
        name: 'Bold'
    }
]

router.get('/users', async (ctx, next) => {
    ctx.response.body = users
})

router.get('/users/{id}', async (ctx, next) => {
    console.log('用户详情', ctx.request)
    const { id } = ctx.request.params
    ctx.response.body = users.find(user => user.id === id)
})

router.get('/users/{id}/name', async (ctx, next) => {
    console.log('用户详情', ctx.request)
    const { id } = ctx.request.params
    ctx.response.body = users.find(user => user.id === id).name
})

router.get('/debug/request', async (ctx, next) => {
    ctx.response.body = ctx.request
})

router.get('/debug/error', async (ctx, next) => {
    function asd() {
        throw Error('异常错误')
    }
    asd()
    ctx.response.body = '123'
})

app.use(router.routes())

app.on('error', err => {
    console.error('app, on error', err)
})
  
app.listen(8090)

// time stat
app.use(async (ctx, next) => {
    let startTime = new Date().getTime()
    await next()
    let time = new Date().getTime() - startTime
    console.log(`time: ${time}ms`)
})

app.use(async (ctx, next) => {
    console.log('小插件1 start')
    await next()
    console.log('小插件1 end')
})

app.use(async (ctx, next) => {
    ctx.response.headers.a = 'A'
    // console.log('小插件1 start')
    // await next()
    // console.log('小插件1 end')
    await next()
})

app.use(async (ctx, next) => {
    console.log('小插件2 start')
    await next()
    console.log('小插件2 end')
})
