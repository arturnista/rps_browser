module.exports = {
    generateID: (function() {
        let id = 0
        return function() { return '' + id++ }
    })()
}