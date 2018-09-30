const expect = require('expect.js')
const sinon = require('sinon')
const GameInteractor = require('../../src/Game/Interactor')

describe('Game Interactor', () => {

    let deps = {
        Entity: class {
            find() {}
            create() {}
            update() {}
            generateData() {}
            addPlayer() {}
            updatePlayer() {}
            setGameState() {}
        }
    }

    let entMock = null
    afterEach(() => {
        if(entMock && entMock.restore) entMock.restore()
    })
    
    describe('find method', () => {

        it('should find the game and return it', () => {

            const expectedParams = 'game-id'
            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            entMock = sinon.mock(deps.Entity.prototype)
            entMock.expects('find')
                .once()
                .withArgs(expectedParams)
                .returns(expectedResult)

            const interactor = new GameInteractor(deps)
            const result = interactor.find(expectedParams)
            
            expect(result).to.eql(expectedResult)

            entMock.verify()
        })

    })
    
    describe('create method', () => {

        it('should create a new game and add a player', () => {

            const expectedResult = {
                game: {
                    update: 'data'
                }, 
                player: 'NEW-ID'
            }

            entMock = sinon.mock(deps.Entity.prototype)
            entMock.expects('generateData')
                .once()
                .returns({
                    id: 'game-id',
                    game: 'data'
                })
            entMock.expects('addPlayer')
                .once()
                .withArgs({
                    id: 'game-id',
                    game: 'data'
                })
                .returns({
                    game: {
                        addPlayer: 'data'
                    }, 
                    player: 'NEW-ID'
                })
            entMock.expects('setGameState')
                .once()
                .withArgs({
                    addPlayer: 'data'
                })
                .returns({
                    setGameState: 'data'
                })
            entMock.expects('create')
                .once()
                .withArgs({
                    addPlayer: 'data',
                    setGameState: 'data'
                })
                .returns({
                    update: 'data'
                })

            const interactor = new GameInteractor(deps)
            const result = interactor.create()
            
            expect(result).to.eql(expectedResult)
            
            entMock.verify()
        })

    })
    
    describe('enter method', () => {

        it('should find the game and add a player', () => {

            const expectedResult = {
                game: {
                    id: 'game-id',
                    game: 'data'
                },
                player: 'PLAYER-ID'
            }

            entMock = sinon.mock(deps.Entity.prototype)
            entMock.expects('find')
                .once()
                .withArgs('game-id')
                .returns({
                    id: 'game-id',
                    game: 'data'
                })
            entMock.expects('addPlayer')
                .once()
                .withArgs({
                    id: 'game-id',
                    game: 'data'
                })
                .returns({
                    game: {
                        player: 'data'
                    },
                    player: 'PLAYER-ID'
                })
            entMock.expects('setGameState')
                .once()
                .withArgs({
                    player: 'data'
                })
                .returns({
                    setGameState: 'data'
                })
            entMock.expects('update')
                .once()
                .withArgs({
                    setGameState: 'data'
                })
                .returns({
                    id: 'game-id',
                    game: 'data'
                })

            const interactor = new GameInteractor(deps)
            const result = interactor.enter({ game: 'game-id' })
            
            expect(result).to.eql(expectedResult)
            
            entMock.verify()
        })

    })
    
    describe('playerOption method', () => {

        it('should update the player with the new option', () => {

            const expectedResult = {
                id: 'GAME-ID',
                game: 'data'
            }

            entMock = sinon.mock(deps.Entity.prototype)
            entMock.expects('find')
                .once()
                .withArgs('GAME-ID')
                .returns({
                    id: 'GAME-ID',
                    game: 'data'
                })
            entMock.expects('updatePlayer')
                .once()
                .withArgs({
                    id: 'GAME-ID',
                    game: 'data'
                }, { id: 'PLAYER-ID', option: 'rock' })
                .returns({
                    player: 'data'
                })
            entMock.expects('setGameState')
                .once()
                .withArgs({
                    player: 'data'
                })
                .returns({
                    setGameState: 'data'
                })
            entMock.expects('update')
                .once()
                .withArgs({
                    setGameState: 'data'
                })
                .returns({
                    id: 'GAME-ID',
                    game: 'data'
                })

            const interactor = new GameInteractor(deps)
            const result = interactor.playerOption({
                game: 'GAME-ID',
                player: 'PLAYER-ID',
                option: 'rock'
            })
            
            expect(result).to.eql(expectedResult)
            
            entMock.verify()
        })

    })

})