let games = []

class Adapter {

    constructor(deps = {}) {
        // this.games = games
    }

    generateId() {

    }

    create(data) {
        games.push(data)
        return data
    }

    update(data) {
        games = games.map(x => x.id == data.id ? Object.assign({}, x, data) : x)
        return games.find(x => x.id == data.id)
    }
    
    find(id) {
        return games.find(x => x.id == id)
    }

}

module.exports = Adapter
