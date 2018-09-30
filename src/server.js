const Server = require('./httpServer')
const GameTranslator = require('./Game/Translator')
const server = new Server()

server.get('/', (req, res) => {
    res.html(200, './public/index.html')
})
server.get('/game', (req, res) => {
    const translator = new GameTranslator()
    translator.get(req, res)
})
server.post('/game', (req, res) => {
    const translator = new GameTranslator()
    translator.post(req, res)
})
server.put('/game', (req, res) => {
    const translator = new GameTranslator()
    translator.put(req, res)
})
server.post('/game/option', (req, res) => {
    res.json(200, { status: 'ok' })
})
server.get('/main.css', (req, res) => {
    res.file(200, './public/css/main.css')
})
server.get('/main.js', (req, res) => {
    res.file(200, './public/js/main.js')
})

server.start(3000)