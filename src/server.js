const Server = require('./httpServer')
const server = new Server()

server.get('/', (req, res) => {
    res.html(200, './public/index.html')
})
server.post('/option', (req, res) => {
    console.log(req.body)
    res.json(200, { status: 'ok' })
})
server.get('/main.css', (req, res) => {
    res.file(200, './public/css/main.css')
})
server.get('/main.js', (req, res) => {
    res.file(200, './public/js/main.js')
})

server.start(3000)