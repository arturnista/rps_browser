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
    
    describe('create method', () => {

        it('should create the game with empty players and status as waiting_player', () => {

            const expectedResult = {
                id: 'NEW-ID',
                players: [],
                status: 'waiting_player'
            }

            adpMock = sinon.mock(deps.Adapter.prototype)
            adpMock.expects('create')
                .once()
                .withArgs(expectedResult)

            const entity = new GameEntity(deps)
            const result = entity.create()
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })
    
    describe('addPlayer method', () => {

        it('should add a new player to the game', () => {

            const expectedResult = {
                id: 'NEW-ID',
                status: 'playing',
                option: ''
            }

            adpMock = sinon.mock(deps.Adapter.prototype)
            adpMock.expects('update')
                .once()
                .withArgs('GAME-ID', {
                    id: 'GAME-ID',
                    players: [expectedResult]
                })

            const entity = new GameEntity(deps)
            const result = entity.addPlayer({
                id: 'GAME-ID',
                players: []
            })
            
            expect(result).to.eql(expectedResult)

            adpMock.verify()
        })

    })

})