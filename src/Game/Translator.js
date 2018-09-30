class Translator {

    constructor(deps = {}) {
        this.Interactor = deps.Interactor || require('./Interactor')
    }

    get(req, res) {
        const interactor = new this.Interactor()
        
        try {
            const id = req.url.searchParams.get('game')
            const result = interactor.find(id)
            if(!result) return res.json(404, { error: 'not-found' })
            res.json(200, result)
        } catch(err) {
            console.log(err)
            res.json(500, err)
        }
    }

    post(req, res) {
        const interactor = new this.Interactor()
        
        try {
            const result = interactor.create(req.body)
            res.json(200, result)
        } catch(err) {
            console.log(err)
            res.json(500, err)
        }
    }

    put(req, res) {
        const interactor = new this.Interactor()
        
        try {
            const result = interactor.enter(req.body)
            res.json(200, result)
        } catch(err) {
            console.log(err)
            res.json(500, err)
        }
    }
}

module.exports = Translator