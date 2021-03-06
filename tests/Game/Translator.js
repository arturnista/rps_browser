const expect = require('expect.js')
const sinon = require('sinon')
const GameTranslator = require('../../src/Game/Translator')

describe('Game translator', () => {

    let deps = {
        Interactor: class {
            find() {}
            create() {}
            enter() {}
            playerOption() {}
            leave() {}
        }
    }

    let intMock = null
    afterEach(() => {
        if(intMock && intMock.restore) intMock.restore()
    })
    
    describe('get method', () => {

        it('should return the server data', () => {

            const expectedParams = 'game-id'
            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                url: {
                    searchParams: {
                        get: () => {}
                    }
                }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('find')
                .once()
                .withArgs(expectedParams)
                .returns(expectedResult)

            reqUrlMock = sinon.mock(req.url.searchParams)
            reqUrlMock.expects('get')
                .once()
                .withArgs('game')
                .returns(expectedParams)

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(200, expectedResult)

            const translator = new GameTranslator(deps)
            translator.get(req, res)
            
            intMock.verify()
            reqUrlMock.verify()
            resMock.verify()
        })

        it('should return 404 if the server is not found', () => {

            const expectedParams = 'game-id'

            const req = {
                url: {
                    searchParams: {
                        get: () => {}
                    }
                }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('find')
                .once()
                .withArgs(expectedParams)
                .returns(null)

            reqUrlMock = sinon.mock(req.url.searchParams)
            reqUrlMock.expects('get')
                .once()
                .withArgs('game')
                .returns(expectedParams)

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(404, { error: 'not-found' })

            const translator = new GameTranslator(deps)
            translator.get(req, res)
            
            intMock.verify()
            reqUrlMock.verify()
            resMock.verify()
        })

    })
    
    describe('post method', () => {

        it('should create the game and return the game data', () => {

            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                url: {
                    searchParams: {
                        get: () => {}
                    }
                }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('create')
                .once()
                .returns(expectedResult)

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(200, expectedResult)

            const translator = new GameTranslator(deps)
            translator.post(req, res)
            
            intMock.verify()
            resMock.verify()
        })

    })
    
    describe('put method', () => {

        it('should enter the game and return the game data', () => {

            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                url: {
                    searchParams: {
                        get: () => {}
                    }
                }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('enter')
                .once()
                .returns(Promise.resolve(expectedResult))

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(200, expectedResult)

            const translator = new GameTranslator(deps)
            return translator.put(req, res)
            .then(res => {
                intMock.verify()
                resMock.verify()
            })
            
        })

        it('should return an error if leave throws', () => {

            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                url: {
                    searchParams: {
                        get: () => {}
                    }
                }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('enter')
                .once()
                .returns(Promise.reject({ status: 400, error: 'message' }))

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(400, { status: 400, error: 'message' })

            const translator = new GameTranslator(deps)
            return translator.put(req, res)
            .then(res => {
                intMock.verify()
                resMock.verify()
            })
            
        })

    })
    
    describe('postLeave method', () => {

        it('should create the game and return the game data', () => {

            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                body: { body: 'data' }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('leave')
                .once()
                .withArgs({ body: 'data' })
                .returns(Promise.resolve(expectedResult))

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(200, expectedResult)

            const translator = new GameTranslator(deps)
            return translator.postLeave(req, res)
            .then(res => {
                intMock.verify()
                resMock.verify()
            })
            
        })

    })
    
    describe('postOption method', () => {

        it('should create the game and return the game data', () => {

            const expectedResult = {
                id: 'game-id',
                game: 'data'
            }

            const req = {
                body: { body: 'data' }
            }

            const res = {
                json: () => {}
            }

            intMock = sinon.mock(deps.Interactor.prototype)
            intMock.expects('playerOption')
                .once()
                .withArgs({ body: 'data' })
                .returns(Promise.resolve(expectedResult))

            resMock = sinon.mock(res)
            resMock.expects('json')
                .once()
                .withArgs(200, expectedResult)

            const translator = new GameTranslator(deps)
            return translator.postOption(req, res)
            .then(res => {
                intMock.verify()
                resMock.verify()
            })
            
        })

    })

})