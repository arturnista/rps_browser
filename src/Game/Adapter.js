let games = []
let queue = []
let queueIsRunning = false

function executeUpdates() {
    var queueFun = queue.pop()
    if(queueFun) return queueFun().then(newGames => {
        games = newGames
        return executeUpdates()
    })
    else queueIsRunning = false
}

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

    update(data, action) {
        return new Promise((resolve, reject) => {
            queue.push(() => {
                const newGames = games.map(x => x.id == data.id ? Object.assign({}, x, data) : x)
                const game = newGames.find(x => x.id == data.id)
                resolve(game)
                return Promise.resolve(newGames)
            })
    
            if(!queueIsRunning) {
                queueIsRunning = true
                executeUpdates()
            }
        })
    }
    
    find(id) {
        return games.find(x => x.id == id)
    }

}

module.exports = Adapter
