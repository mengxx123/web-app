# web-app

一个简单的 web 框架。



安装

```js
npm i @yunser/web-app
```

使用

```js
const { App, Router } = require('@yunser/web-app')

const app = new App()
const router = new Router()

router.get('/', async (ctx, next) => {
    ctx.response.body = 'Hello Yunser'
})

app.listen(8090)
```

浏览器打开 `http://localhost:8090`。


## 功能

* Hello world


## TODO

* 路由
* 插件的扩展机制
* 异常的监控处理
1.路由或者智能路由 2.静态文件输出 3.session/cookie 4.模版渲染 5.数据库处理 6.文件上传


cnpm install -g  nodemon
nodemon app.js

qps-limit

