const server = require('./httpServer')

server.get('/', (req, res) => {
    console.log('GET para o /')
    res.html(200, './public/index.html')
    // res.end('<h1>Dale</h1>')
})

server.start(3000)