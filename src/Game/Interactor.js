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
        
        let game = entity.generateData()
        game = entity.addPlayer(game)
        const gameState = entity.setGameState(game)
        game = entity.create(Object.assign({}, game, gameState))

        return game
    } 
    
    enter(body) {
        const entity = new this.Entity()
        
        let game = entity.find(body.game)
        game = entity.addPlayer(game)
        game = entity.setGameState(game)
        game = entity.update(game)

        return game
    }

    playerOption(body) {
        const entity = new this.Entity()
        
        let game = entity.find(body.game)
        game = entity.updatePlayer(game, { id: body.player, option: body.option })
        game = entity.setGameState(game)
        game = entity.update(game)

        return game
    }

}

module.exports = Interactor
