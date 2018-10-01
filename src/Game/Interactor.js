class Interactor {

    constructor(deps = {}) {
        this.Entity = deps.Entity || require('./Entity')
    }

    find(id) {
        const entity = new this.Entity()
        
        return entity.find(id)
    }
    
    create() {
        const entity = new this.Entity()
        
        let gameData = entity.generateData()
        let { game, player } = entity.addPlayer(gameData)
        const gameState = entity.setGameState(game)
        game = entity.create(Object.assign({}, game, gameState))

        return { game, player }
    } 
    
    enter(body) {
        const entity = new this.Entity()
        
        let gameData = entity.find(body.game)
        let { game, player } = entity.addPlayer(gameData)
        game = entity.setGameState(game)
        return entity.update(game, 'enter')
        .then(game => ({ game, player }))
    }
    
    leave(body) {
        const entity = new this.Entity()
        
        let gameData = entity.find(body.game)
        let game = entity.removePlayer(gameData, body.player)
        game = entity.setGameState(game)
        return entity.update(game, 'leave')
    }

    playerOption(body) {
        const entity = new this.Entity()
        
        let game = entity.find(body.game)
        game = entity.updatePlayer(game, { id: body.player, option: body.option })
        game = entity.setGameState(game)
        return entity.update(game, 'playerOption')
    }

}

module.exports = Interactor
