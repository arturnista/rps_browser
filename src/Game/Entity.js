class Entity {

    constructor(deps = {}) {
        this.Adapter = deps.Adapter || require('./Adapter')
        this.utils = deps.utils || require('../utils')
    }
    
    find(id) {
        const adapter = new this.Adapter()
        
        return adapter.find(id)
    }
    
    create() {
        const adapter = new this.Adapter()
        
        const gameData = {
            id: this.utils.generateID(),
            players: [],
            status: 'waiting_player',
        }
        adapter.create(gameData)

        return gameData
    }

    addPlayer(game) {
        const adapter = new this.Adapter()
        
        const playerData = {
            id: this.utils.generateID(),
            status: 'playing',
            option: ''
        }

        game.players.push(playerData)
        adapter.update(game.id, game)

        return playerData
    }

}

module.exports = Entity
