class Entity {

    constructor(deps = {}) {
        this.Adapter = deps.Adapter || require('./Adapter')
        this.utils = deps.utils || require('../utils')
    }
    
    find(id) {
        const adapter = new this.Adapter()
        
        return adapter.find(id)
    }

    create(game) {
        const adapter = new this.Adapter()
        
        return adapter.create(game)
    }

    update(game) {
        const adapter = new this.Adapter()
        
        return adapter.update(game)
    }
    
    generateData() {
        return {
            id: this.utils.generateID(),
            players: [],
            round: 0,
            result: [],
            config: {
                rock: {
                    win: ['scissors'],
                    lose: ['paper'],
                    draw: ['rock'],
                }, 
                scissors: {
                    win: ['paper'],
                    lose: ['rock'],
                    draw: ['scissors'],
                }, 
                paper: {
                    win: ['rock'],
                    lose: ['scissors'],
                    draw: ['paper'],
                }
            },
            status: 'waiting_player',
        }
    }

    addPlayer(game) {
        const adapter = new this.Adapter()
        
        const playerData = {
            id: this.utils.generateID(),
            status: 'selecting',
            option: ''
        }

        game.players.push(playerData)
        return {
            game,
            player: playerData.id
        }
    }

    updatePlayer(game, player) {
        const adapter = new this.Adapter()

        game.players = game.players.map(x => {
            if(x.id != player.id) return x

            const newData = Object.assign({}, x, player)
            if(newData.option) newData.status = 'ready'

            return newData
        })

        return game
    }

    setGameState(game) {
        if(game.players.length <= 1) return { id: game.id, status: 'waiting' }
        if(!game.players.every(x => x.status === 'ready')) return { id: game.id, status: 'playing' }
        
        const lastRound = game.players.map(pl => {
            const points = game.players.reduce((prev, current) => {
                if(current.id === pl.id) return prev
                if(game.config[pl.option].win.indexOf(current.option) !== -1) return prev + 1
                return prev
            }, 0)
            
            return { id: pl.id, points }
        })

        const result = lastRound.map(x => {
            const currentResult = game.result.find(l => l.id == x.id)
            if(!currentResult) return x
            return {
                id: x.id,
                points: x.points + currentResult.points
            }
        })

        const players = game.players.map(x => Object.assign({}, x, { option: '', status: 'selecting' }))

        return { id: game.id, round: game.round + 1, players, status: 'playing', lastRound, result }
    }

}

module.exports = Entity
