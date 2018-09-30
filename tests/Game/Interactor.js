const expect = require('expect.js')
const sinon = require('sinon')
const GameInteractor = require('../../src/Game/Interactor')

describe('Game Interactor', () => {

    let deps = {
        Entity: class {
            find() {}
            create() {}
            addPlayer() {}
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
                    id: 'game-id',
                    game: 'data'
                }, 
                player: {
                    player: 'data'
                }
            }

            entMock = sinon.mock(deps.Entity.prototype)
            entMock.expects('create')
                .once()
                .returns({
                    id: 'game-id',
                    game: 'data'
                })
            entMock.expects('find')
                .once()
                .withArgs('game-id')
                .returns({ 
                    find: 'result'
                })
            entMock.expects('addPlayer')
                .once()
                .withArgs({ find: 'result' })
                .returns({
                    player: 'data'
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
                player: {
                    player: 'data'
                }
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
                    player: 'data'
                })

            const interactor = new GameInteractor(deps)
            const result = interactor.enter({ game: 'game-id' })
            
            expect(result).to.eql(expectedResult)
            
            entMock.verify()
        })

    })

})