const Server = require('./httpServer')
const server = new Server()

server.get('/', (req, res) => {
    res.html(200, './public/index.html')
})
server.get('/main.css', (req, res) => {
    res.file(200, './public/css/main.css')
})

server.start(3000)