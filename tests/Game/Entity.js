const expect = require('expect.js')
const sinon = require('sinon')
const GameEntity = require('../../src/Game/Entity')

describe('Game Entity', () => {

    let deps = {
        Adapter: class {
            find() {}
            create() {}
            update() {}
        },
        utils: {
            generateID: () => 'NEW-ID'
        }
    }

    let adpMock = null
    afterEach(() => {
        if(adpMock && adpMock.restore) adpMock.restore()
    })
    
    describe('find method', () => {

        it('should find the game and return it', () => {

            const expectedParams = 'game-id'
            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            adpMock = sinon.mock(deps.Adapter.prototype)
            adpMock.expects('find')
                .once()
                .withArgs(expectedParams)
                .returns(expectedResult)

            const entity = new GameEntity(deps)
            const result = entity.find(expectedParams)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })
    
    describe('update method', () => {

        it('should update the game and return it', () => {

            const expectedParams = {
                id: 'game-id',
                game: 'params'
            }
            const expectedResult = {
                id: 'game-id',
                game: 'result'
            }

            adpMock = sinon.mock(deps.Adapter.prototype)
            adpMock.expects('update')
                .once()
                .withArgs(expectedParams)
                .returns(expectedResult)

            const entity = new GameEntity(deps)
            const result = entity.update(expectedParams)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })
    
    describe('create method', () => {

        it('should create the game and return it', () => {

            const expectedParams = {
                id: 'game-id',
                game: 'params'
            }
            const expectedResult = {
                id: 'game-id',
                game: 'result'
            }

            adpMock = sinon.mock(deps.Adapter.prototype)
            adpMock.expects('create')
                .once()
                .withArgs(expectedParams)
                .returns(expectedResult)

            const entity = new GameEntity(deps)
            const result = entity.create(expectedParams)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })
    
    describe('generateData method', () => {

        it('should generateData the game with empty players and status as waiting_player', () => {

            const expectedResult = {
                id: 'NEW-ID',
                players: [],
                config: {
                    rock: {
                        win: ['scissor'],
                        lose: ['paper'],
                        draw: ['rock'],
                    }, 
                    scissor: {
                        win: ['paper'],
                        lose: ['rock'],
                        draw: ['scissor'],
                    }, 
                    paper: {
                        win: ['rock'],
                        lose: ['scissor'],
                        draw: ['paper'],
                    }
                },
                status: 'waiting_player'
            }

            const entity = new GameEntity(deps)
            const result = entity.generateData()
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })
    
    describe('addPlayer method', () => {

        it('should add a new player to the game', () => {

            const expectedResult = {
                game: {
                    id: 'GAME-ID',
                    players: [{
                        id: 'NEW-ID',
                        status: 'selecting',
                        option: ''
                    }]
                },
                player: 'NEW-ID'
            }

            const entity = new GameEntity(deps)
            const result = entity.addPlayer({
                id: 'GAME-ID',
                players: []
            })
            
            expect(result).to.eql(expectedResult)
        })

        it('should add a new player to the game, even with other players', () => {

            const expectedResult = {
                game: {
                    id: 'GAME-ID',
                    players: [{
                        id: '1', status: 'selecting', option: ''
                    }, {
                        id: 'NEW-ID',
                        status: 'selecting',
                        option: ''
                    }]
                },
                player: 'NEW-ID'
            }

            const entity = new GameEntity(deps)
            const result = entity.addPlayer({
                id: 'GAME-ID',
                players: [{
                    id: '1', status: 'selecting', option: ''
                }]
            })
            
            expect(result).to.eql(expectedResult)
        })
    })
    
    describe('updatePlayer method', () => {

        it('should update the player data, changing the status', () => {

            const expectedResult = {
                id: 'GAME-ID',
                players: [{
                    id: '1',
                    option: '',
                    status: 'selecting'
                }, {
                    id: '2',
                    option: 'rock',
                    status: 'ready'
                }]
            }

            const entity = new GameEntity(deps)
            const result = entity.updatePlayer({
                id: 'GAME-ID',
                players: [{
                    id: '1',
                    option: '',
                    status: 'selecting'
                }, {
                    id: '2',
                    option: '',
                    status: 'selecting'
                }]
            }, {
                id: '2',
                option: 'rock'
            })
            
            expect(result).to.eql(expectedResult)

        })

    })
    
    describe('setGameState method', () => {

        it("should set the game state to waiting if there's less than one player", () => {
            
            const expectedResult = {
                id: 'GAME-ID',
                status: 'waiting'
            }

            const gameData = {
                id: 'GAME-ID',
                players: []
            }

            const entity = new GameEntity(deps)
            const result = entity.setGameState(gameData)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

        it("should set the game state to playing if there's more than one player", () => {
            
            const expectedResult = {
                id: 'GAME-ID',
                status: 'playing'
            }

            const gameData = {
                id: 'GAME-ID',
                players: [{
                    id: '1',
                    option: '',
                    status: 'selecting'
                }, {
                    id: '2',
                    option: '',
                    status: 'selecting'
                }]
            }

            const entity = new GameEntity(deps)
            const result = entity.setGameState(gameData)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

        it("should set the game state to finish both players are ready, computing the amount of points each player gains", () => {
            
            const expectedResult = {
                id: 'GAME-ID',
                status: 'finish',
                winner: [
                    { id: '1', points: 0 },
                    { id: '2', points: 1 },
                ]
            }

            const gameData = {
                id: 'GAME-ID',
                config: {
                    rock: {
                        win: ['scissor'],
                        lose: ['paper'],
                        draw: ['rock'],
                    }, 
                    scissor: {
                        win: ['paper'],
                        lose: ['rock'],
                        draw: ['scissor'],
                    }, 
                    paper: {
                        win: ['rock'],
                        lose: ['scissor'],
                        draw: ['paper'],
                    }
                },
                players: [{
                    id: '1',
                    option: 'rock',
                    status: 'ready'
                }, {
                    id: '2',
                    option: 'paper',
                    status: 'ready'
                }]
            }

            const entity = new GameEntity(deps)
            const result = entity.setGameState(gameData)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

        it("should compute the points individually for each player", () => {
            
            const expectedResult = {
                id: 'GAME-ID',
                status: 'finish',
                winner: [
                    { id: '1', points: 1 },
                    { id: '2', points: 1 },
                    { id: '3', points: 2 },
                    { id: '4', points: 1 },
                ]
            }

            const gameData = {
                id: 'GAME-ID',
                config: {
                    rock: {
                        win: ['scissor'],
                        lose: ['paper'],
                        draw: ['rock'],
                    }, 
                    scissor: {
                        win: ['paper'],
                        lose: ['rock'],
                        draw: ['scissor'],
                    }, 
                    paper: {
                        win: ['rock'],
                        lose: ['scissor'],
                        draw: ['paper'],
                    }
                },
                players: [{
                    id: '1',
                    option: 'rock',
                    status: 'ready'
                }, {
                    id: '2',
                    option: 'paper',
                    status: 'ready'
                }, {
                    id: '3',
                    option: 'scissor',
                    status: 'ready'
                }, {
                    id: '4',
                    option: 'paper',
                    status: 'ready'
                }]
            }

            const entity = new GameEntity(deps)
            const result = entity.setGameState(gameData)
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })

})