const url = require('url')
const http = require('http')
const querystring = require('querystring')
const path = require('path')
const fs = require('fs')

// let port = 8090




class App {
    // version: 'v1.0.0',

    constructor() {
        this.context = {}
        this.middlewares = []
        this.keys = ''
    }

    listen(port) {
        
    }

    listen(port) {
        http.createServer(async (req, res) => {
            // console.log('req', req)
            try {
                var urlPares=url.parse(req.url);
                var query=querystring.parse(urlPares.query);

                let reqPath
                if (req.url.includes('?')) {
                    reqPath = req.url.split('?')[0]
                } else {
                    reqPath = req.url
                }
    
                let context = {
                    _req: req,
                    _res: res,
                    request: {
                        url: req.url,
                        path: reqPath,
                        query,
                        params: {},
                        headers: req.headers,
                    },
                    response: {
                        headers: {},
                        // body,
                    },
                }

                const { request, response } = context

                // context
    
                // const pathname = url.parse(req.url).pathname;
                // const filepath = path.join(process.cwd(), pathname);
                // console.log('filepath', filepath)
                // try {
                //     if (fs.existsSync(filepath)) {
                //         console.log('存在')
                //         const file = fs.readFileSync(filepath);
                //         res.end(file);
                //         } else {
                //     res.end('404\n');
                //     }
                // } catch (err) {
                //     console.log('err', err)
                //     res.end('server error\n', err)
                // }
                // for (let i = 0 ; i < this.middlewares.length)
                // for (let middleware of this.middlewares) {
                //     await middleware(context)
                // }
                let fn = this.compose(context)
                await fn().catch(err => {
                    // console.log('catch err', err)
                    res.end('server error 500,' + JSON.stringify(err))
                })
            // return fn(ctx).then(respond);

                // res.end(JSON.stringify(this.context.body))
                for (let header in response.headers) {
                    res.setHeader(header, response.headers[header])
                }
                res.writeHead(response.status || '200')
                if (typeof response.body === 'string') {
                    res.end(response.body)
                } else {
                    res.end(JSON.stringify(response.body))
                }
            } catch (err) {
                // console.log('err', err)
                res.end('server error 500,' + JSON.stringify(err))
            }
        }).listen(port)

        // console.log(`server on ${port}`)
        // console.log(`http://localhost:${port}`)
    }

    use(handler) {
        if (typeof handler === 'function') {
            this.middlewares.push(handler)
        } else {
            throw Error(`use 的第一个参数必须是回调函数，but ${typeof handler}`)
        }
    }


    on(name, callback) {

    }

    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     * @return {Function}
     */
    // compose() {
    //     // 将middlewares合并为一个函数，该函数接收一个ctx对象
    //     return async ctx => {

    //         function createNext(middleware, oldNext) {
    //             return async () => {
    //                 await middleware(ctx, oldNext);
    //             }
    //         }

    //         let len = this.middlewares.length;
    //         let next = async () => {
    //             return Promise.resolve();
    //         };
    //         for (let i = len - 1; i >= 0; i--) {
    //             let currentMiddleware = this.middlewares[i];
    //             next = createNext(currentMiddleware, next);
    //         }

    //         await next();
    //     };
    // }

    compose(context) {
        let middlewares = this.middlewares
        let ctx = context

        function getNext(middlewares, idx) {
            // console.log('idx', idx)
            if (idx === middlewares.length - 1) {
                return async () => {
                    await middlewares[idx](ctx, async () => {
                        return Promise.resolve()
                    })
                }
            }
            return async () => {
                await middlewares[idx](ctx, getNext(middlewares, idx + 1))
                // await middlewares[idx](ctx, getNext(middlewares, idx + 1))
            }
            // return middlewares[idx](ctx, async () => {
            //     await com(middlewares, idx + 1)
            // })

        }
        // if (middlewares.length === 1) {
        //     return async () => {
        //         middlewares[0](ctx, async () => {
        //             return Promise.resolve()
        //         })
        //     }
        // }
        return async () => {
            middlewares[0](ctx, getNext(middlewares, 1))
        }
    }
}

module.exports = {
    App,
}
