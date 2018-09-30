class Server {

    constructor(deps = {}) {

        this.httpDeps = deps.http || require('http')
        this.fsDeps = deps.fs || require('fs')

        this.methods = {
            'GET': {},
            'POST': {},
            'PUT': {},
            'DELETE': {}
        }

        this.server = this.httpDeps.createServer(this.handleRequest.bind(this))
        
    }

    handleRequest(req, res) {
        if(!this.methods[req.method] || !this.methods[req.method][req.url]) {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.write(JSON.stringify({ error: 'method not defined', status: 500 }))
            res.end()
            return 
        }

        res.json = (status, json) => {
            res.statusCode = status
            res.setHeader('content-type', 'application/json')
            res.write(JSON.stringify(json))
            res.end()
        }

        res.html = (status, filename) => {
            res.statusCode = status
            res.setHeader('content-type', 'text/html')
            this.fsDeps.readFile(filename, 'utf-8', (error, fileData) => {
                if(error) {
                    res.statusCode = 500
                    res.write(`<h1>File ${filename} not found!</h1>`)
                    res.end()
                    return
                }
                res.write(fileData)
                res.end()
            })
        }
        
        this.methods[req.method][req.url](req, res)
    }

    get(url, callback) {
        this.methods.GET[url] = callback
    }
    
    post(url, callback) {
        this.methods.POST[url] = callback
    }
    
    put(url, callback) {
        this.methods.PUT[url] = callback
    }
    
    del(url, callback) {
        this.methods.DELETE[url] = callback
    }
    

    start(port, ip = 'localhost') {
        this.server.listen(port, ip, () => {
            console.log(`Game server running at http://${ip}:${port}`)
        })
    }
}

module.exports = Server