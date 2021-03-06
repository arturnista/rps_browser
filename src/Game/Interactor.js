class Interactor {

    constructor(deps = {}) {
        this.Entity = deps.Entity || require('./Entity')
    }

    find(id) {
        const entity = new this.Entity()
        
        return entity.find(id)
    }
    
    create(body) {
        const entity = new this.Entity()
        
        let gameData = entity.generateData(body)

        let player = null

        let { game, ...playerCreationData } = entity.addPlayer(gameData)
        // Only assign Player if the there's a player at the game
        if(gameData.mode !== 'cvc') player = playerCreationData.player
        // Only add a second player if it isn't a PVP game
        if(gameData.mode !== 'pvp') game = entity.addPlayer(gameData).game

        const gameState = entity.setGameState(game)
        game = entity.create(Object.assign({}, game, gameState))

        return { game, player }
    } 
    
    enter(body) {
        const entity = new this.Entity()
        
        let gameData = entity.find(body.game)
        if(!gameData) return Promise.reject({ status: 404, error: 'not-found' })            
        if(gameData.mode != 'pvp') return Promise.reject({ status: 409, error: 'not-pvp' })

        let { game, player } = entity.addPlayer(gameData)
        game = entity.setGameState(game)
        return entity.update(game, 'enter')
        .then(game => ({ game, player }))
    }
    
    leave(body) {
        const entity = new this.Entity()
        
        let gameData = entity.find(body.game)
        if(!gameData) return Promise.resolve(null)

        let game = entity.removePlayer(gameData, body.player)
        game = entity.setGameState(game)
        return entity.update(game, 'leave')
    }

    playerOption(body) {
        const entity = new this.Entity()
        
        let game = entity.find(body.game)
        game = entity.updatePlayer(game, { id: body.player, option: body.option })
        if(game.mode === 'pvc' || game.mode === 'cvc') {
            const otherPlayer = game.players.find(x => x.id != body.player)
            const randomOption = entity.getRandomOption(game)
            game = entity.updatePlayer(game, { id: otherPlayer.id, option: randomOption })            
        }
        game = entity.setGameState(game)
        return entity.update(game, 'playerOption')
    }

}

module.exports = Interactor
