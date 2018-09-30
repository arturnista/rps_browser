class Adapter {

    constructor(deps = {}) {
        this.games = []
    }

    generateId() {

    }

    create(data) {
        this.games.push(data)
    }

    update(id, data) {
        this.games = this.games.map(x => x.id == id ? Object.assign({}, x, data) : x)
        return data
    }
    
    find(id) {
        this.games.find(x => x.id == id)
    }

}

module.exports = Adapter
