function getParams(path, p2) {
    let params = {}
    
    
    let regex = path.replace(/{([^/]+?)}/g, (a, key) => {
        // console.log('a, b', a, key)
        params[key] = null
        return '([^/]+?)'
    })
    regex = `^${regex}$`
    // console.log('regex', regex)
    
    let match = p2.match(new RegExp(regex))
    // if ()
    if (!match) {
        return null
    }
    // console.log(match)
    let idx = 1
    for (let key in params) {
        params[key] = match[idx++]
    }
    // console.log('params', params)
    return params
}

class Router {

    constructor() {
        this._routers = []
    }

    get(path, handler) {
        this._request('GET', path, handler)
    }

    head(path, handler) {
        this._request('HEAD', path, handler)
    }

    post(path, handler) {
        this._request('POST', path, handler)
    }

    put(path, handler) {
        this._request('PUT', path, handler)
    }

    delete(path, handler) {
        this._request('DELETE', path, handler)
    }

    delete(path, handler) {
        this._request('DELETE', path, handler)
    }

    connect(path, handler) {
        this._request('CONNECT', path, handler)
    }

    options(path, handler) {
        this._request('OPTIONS', path, handler)
    }

    trace(path, handler) {
        this._request('TRACE', path, handler)
    }

    _request(method, path, handler) {
        this._routers.push({
            method,
            path,
            handler,
        })
    }

    routes(ctx, next) {
        return async (ctx, next) => {
            // console.log('路由插件 start')
            const { request } = ctx
            // console.log(`GET ${request.path}`)
            // await next();
            let isFound = false
            for (let router of this._routers) {
                if (router.path.includes('{')) {
                    let params = getParams(router.path, request.path)
                    // console.log('动态路由', params, router.path, request.path)
                    if (params) {
                        isFound = true
                        request.params = params
                        await router.handler(ctx, next)
                        break
                    }
                } else if (request.path === router.path) {
                    isFound = true
                    await router.handler(ctx, next)
                    // next()
                    break
                }
            }
            if (!isFound) {
                // ctx
                ctx.response.status = 404
                ctx.response.body = '<h5>404</h5>';
            }

            
            await next()
            // console.log('路由插件 end')
            // if (ctx.request.path == '/about') {
            //     ctx.response.type = 'html'; // 指定返回类型为 html 类型
            //     ctx.response.body = 'this is about page <a href="/">Go Index Page</a>';
            // } else {
            //     ctx.response.body = {
            //         request: ctx.request,
            //         // response: ctx.response,
            //     }
            // }
        }
    }
}

module.exports = {
    Router,
}