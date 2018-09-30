const expect = require('expect.js')
const Server = require('../src/httpServer')

describe('Http Server', () => {
    
    describe('constructor method', () => {

        it('should create the server', () => {

            const expectedServer = { server: 'object' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            expect(httpCreated).to.be.ok()
            expect(server.server).to.eql(expectedServer)
        })

    })

    describe('get method', () => {

        it('should add "/" method on GET', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.get('/', expectedCallback)

            expect(server.methods.GET['/']).to.equal(expectedCallback)
        })

        it('should add "/" and "/other" method on GET', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.get('/', expectedCallback)

            const otherExpectedCallback = () => {}
            server.get('/other', otherExpectedCallback)

            expect(server.methods.GET['/']).to.equal(expectedCallback)
            expect(server.methods.GET['/other']).to.equal(otherExpectedCallback)
        })

    })
    
    describe('post method', () => {

        it('should add "/" method on POST', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.post('/', expectedCallback)

            expect(server.methods.POST['/']).to.equal(expectedCallback)
        })

        it('should add "/" and "/other" method on POST', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.post('/', expectedCallback)

            const otherExpectedCallback = () => {}
            server.post('/other', otherExpectedCallback)

            expect(server.methods.POST['/']).to.equal(expectedCallback)
            expect(server.methods.POST['/other']).to.equal(otherExpectedCallback)
        })

    })
    
    describe('put method', () => {

        it('should add "/" method on PUT', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.put('/', expectedCallback)

            expect(server.methods.PUT['/']).to.equal(expectedCallback)
        })

        it('should add "/" and "/other" method on PUT', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.put('/', expectedCallback)

            const otherExpectedCallback = () => {}
            server.put('/other', otherExpectedCallback)

            expect(server.methods.PUT['/']).to.equal(expectedCallback)
            expect(server.methods.PUT['/other']).to.equal(otherExpectedCallback)
        })

    })
    
    describe('del method', () => {

        it('should add "/" method on DELETE', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.del('/', expectedCallback)

            expect(server.methods.DELETE['/']).to.equal(expectedCallback)
        })

        it('should add "/" and "/other" method on DELETE', () => {
            const deps = {
                http: {
                    createServer: () => {},
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)

            const expectedCallback = () => {}
            server.del('/', expectedCallback)

            const otherExpectedCallback = () => {}
            server.del('/other', otherExpectedCallback)

            expect(server.methods.DELETE['/']).to.equal(expectedCallback)
            expect(server.methods.DELETE['/other']).to.equal(otherExpectedCallback)
        })

    })
    
    describe('handleRequest method', () => {

        it('should return a 500 if the method is not defined', () => {

            const expectedServer = { server: 'object' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('application/json')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql(JSON.stringify({ error: 'method not defined', status: 500 }))
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                }
            }

            const server = new Server(deps)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(endCalled).to.be.ok()
            expect(headerCalled).to.be.ok()
            expect(writeCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
            expect(resMock.statusCode).to.eql(500)
        })

        it('should call the defined method if requesting GET "/"', () => {

            const expectedServer = { server: 'object' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('application/json')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql(JSON.stringify({ error: 'method not defined', status: 500 }))
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                }
            }

            let callbackCalled = false
            const expectedCallback = (req, res) => {
                expect(req).to.eql(reqMock)
                expect(res).to.eql(resMock)
                callbackCalled = true
            }

            const server = new Server(deps)
            server.get('/', expectedCallback)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(callbackCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
        })

        it('should define JSON method at result object', () => {

            const expectedServer = { server: 'object' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('application/json')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql(JSON.stringify({ error: 'method not defined', status: 500 }))
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                }
            }

            let callbackCalled = false
            const expectedCallback = (req, res) => {
                expect(req).to.eql(reqMock)
                expect(res).to.eql(resMock)
                expect(res).to.have.property('json')
                expect(res).to.have.property('html')
                callbackCalled = true
            }

            const server = new Server(deps)
            server.get('/', expectedCallback)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(callbackCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
        })

        it('should set header, write and end if call json method', () => {

            const expectedServer = { server: 'object' }
            const expectedResult = { some: 'data' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('application/json')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql(JSON.stringify(expectedResult))
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                }
            }

            let callbackCalled = false
            const expectedCallback = (req, res) => {
                res.json(200, expectedResult)
                callbackCalled = true
            }

            const server = new Server(deps)
            server.get('/', expectedCallback)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(headerCalled).to.be.ok()
            expect(writeCalled).to.be.ok()
            expect(endCalled).to.be.ok()
            expect(callbackCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
            expect(resMock.statusCode).to.eql(200)
        })

        it('should read the HTML file, set header, write and end if call html method', (done) => {

            const expectedServer = { server: 'object' }
            const expectedResult = { some: 'data' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: (filename, encode, callback) => {
                        expect(encode).to.eql('utf-8')
                        expect(filename).to.eql('./some/file.html')
                        callback(null, 'html-file-content')
                    }
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('text/html')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql('html-file-content')
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                    done()
                }
            }

            let callbackCalled = false
            const expectedCallback = (req, res) => {
                res.html(200, './some/file.html')
                callbackCalled = true
            }

            const server = new Server(deps)
            server.get('/', expectedCallback)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(headerCalled).to.be.ok()
            expect(writeCalled).to.be.ok()
            expect(endCalled).to.be.ok()
            expect(callbackCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
            expect(resMock.statusCode).to.eql(200)
        })

        it('should return a 500 if the file is not found', (done) => {

            const expectedServer = { server: 'object' }
            const expectedResult = { some: 'data' }

            let httpCreated = false
            const deps = {
                http: {
                    createServer: (callback) => {
                        httpCreated = true
                        return expectedServer
                    },
                },
                fs: {
                    readFile: (filename, encode, callback) => {
                        expect(encode).to.eql('utf-8')
                        expect(filename).to.eql('./some/file.html')
                        callback({ some: 'error' })
                    }
                }
            }

            let reqMock = {
                method: 'GET',
                url: '/'
            }

            let headerCalled = false
            let writeCalled = false
            let endCalled = false
            let resMock = {
                statusCode: 0,
                setHeader: (name, value) => {
                    expect(name).to.eql('content-type')
                    expect(value).to.eql('text/html')
                    headerCalled = true
                },
                write: (writeData) => {
                    expect(writeData).to.eql('<h1>File ./some/file.html not found!</h1>')
                    writeCalled = true
                },
                end: () => {
                    endCalled = true
                    done()
                }
            }

            let callbackCalled = false
            const expectedCallback = (req, res) => {
                res.html(200, './some/file.html')
                callbackCalled = true
            }

            const server = new Server(deps)
            server.get('/', expectedCallback)
            server.handleRequest(reqMock, resMock)

            expect(httpCreated).to.be.ok()
            expect(headerCalled).to.be.ok()
            expect(writeCalled).to.be.ok()
            expect(endCalled).to.be.ok()
            expect(callbackCalled).to.be.ok()
            expect(server.server).to.eql(expectedServer)
            expect(resMock.statusCode).to.eql(500)
        })

    })

    describe('start method', () => {

        it('should add "/" method on GET', (done) => {
            const expectedPort = 5000
            const expectedIp = 'my-ip'

            const deps = {
                http: {
                    createServer: () => {
                        return {
                            listen: (port, ip) => {
                                expect(port).to.eql(expectedPort)
                                expect(ip).to.eql(expectedIp)
                                done()
                            }
                        }
                    },
                },
                fs: {
                    readFile: () => {}
                }
            }

            const server = new Server(deps)
            server.start(expectedPort, expectedIp)
        })

    })

})
