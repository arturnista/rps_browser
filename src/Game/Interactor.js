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
        
        const gameData = entity.create()
        const game = entity.find(gameData.id)
        const player = entity.addPlayer(game)

        return {
            game: gameData,
            player
        }
    } 
    
    enter(body) {
        const entity = new this.Entity()
        
        const game = entity.find(body.game)
        const player = entity.addPlayer(game)

        return {
            game,
            player
        }
    }

}

module.exports = Interactor
