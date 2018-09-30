class Server {

    constructor(deps = {}) {

        this.urlDeps = deps.url || require('url')
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
        let url = new this.urlDeps.URL(`http://localhost${req.url}`)
        
        if(!this.methods[req.method] || !this.methods[req.method][url.pathname]) {
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
                    res.statusCode = 404
                    res.write(`<h1>File ${filename} not found!</h1>`)
                    res.end()
                    return
                }
                res.write(fileData)
                res.end()
            })
        }

        res.file = (status, filename) => {
            res.statusCode = status
            let fileType = filename.match(/\.[^\.]*$/g)
            if(fileType) fileType = fileType[0].substring(1)
            else fileType = ''

            let contentType = ''

            switch (fileType) {
                case 'js':
                    contentType = 'application/javascript'
                    break
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                    contentType = `image/${fileType}`
                    break
                default:
                    contentType = `text/${fileType}`
            }

            res.setHeader('content-type', contentType)
            this.fsDeps.readFile(filename, 'utf-8', (error, fileData) => {
                if(error) {
                    res.statusCode = 404
                    res.write(`<h1>File ${filename} not found!</h1>`)
                    res.end()
                    return
                }
                res.write(fileData)
                res.end()
            })
        }
        
        req.url = url
        switch (req.method) {
            case 'POST':
            case 'PUT':
                let body = ''
                req.on('data', (data) => body += data)
                req.on('end', () => {
                    if(body.length > 0) req.body = JSON.parse(body)
                    else req.body = {}
                    this.methods[req.method][url.pathname](req, res)
                })       
                break
            default:
                this.methods[req.method][url.pathname](req, res)
                break
        }
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
    

    start(port) {
        this.server.listen(port, () => {
            console.log(`Server running at ${port}`)
        })
    }
}

module.exports = Server