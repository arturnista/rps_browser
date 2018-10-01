const Server = require('./httpServer')
const GameTranslator = require('./Game/Translator')
const server = new Server()

server.get('/', (req, res) => {
    res.html(200, './public/index.html')
})
server.get('/game', (req, res) => {
    res.html(200, './public/game.html')
})
server.get('/api/game', (req, res) => {
    const translator = new GameTranslator()
    translator.get(req, res)
})
server.post('/api/game', (req, res) => {
    const translator = new GameTranslator()
    translator.post(req, res)
})
server.put('/api/game', (req, res) => {
    const translator = new GameTranslator()
    translator.put(req, res)
})
server.post('/api/game/leave', (req, res) => {
    const translator = new GameTranslator()
    translator.postLeave(req, res)
})
server.post('/api/game/option', (req, res) => {
    const translator = new GameTranslator()
    translator.postOption(req, res)
})
server.get('/main.css', (req, res) => {
    res.file(200, './public/css/main.css')
})
server.get('/index.css', (req, res) => {
    res.file(200, './public/css/index.css')
})
server.get('/game.css', (req, res) => {
    res.file(200, './public/css/game.css')
})
server.get('/index.js', (req, res) => {
    res.file(200, './public/js/index.js')
})
server.get('/game.js', (req, res) => {
    res.file(200, './public/js/game.js')
})

const port = process.env.PORT || 3000
server.start(port)