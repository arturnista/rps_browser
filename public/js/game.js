let game = null
let player = null
let endRoundModal = null
let pointsSpan = null
let lastRoundNumber = 0
let gameMode = ''

let playersAgainst = 0

window.onload = () => {
    endRoundModal = document.getElementById("end-round-modal")
    pointsSpan = document.getElementById("points-span")

    gameMode = window.location.search.match(/[\?\&]mode=[^\?^\&]*/g)
    if(gameMode) gameMode = gameMode[0].replace('?mode=', '')
    else gameMode = 'pvp'
    
    let gameId = window.location.search.match(/[\?\&]game=[^\?^\&]*/g)
    if(gameId) gameId = gameId[0].replace('?game=', '')

    // If the gameID is defined
    if(gameId) enterGame(gameId)
    else createGame()

    pooling()
}

function createGame() {
    fetch('/api/game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mode: gameMode })
    })
    .then(res => {
        return res.json()
        .then(data => {
            if(res.ok) return data
            else throw data
        })
    })
    .then(startGame)
    .catch(errorHandler)
}

function enterGame(gameId) {
    // Enter in a room
    fetch('/api/game', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game: gameId })
    })
    .then(res => {
        return res.json()
        .then(data => {
            if(res.ok) return data
            else throw data
        })
    })
    .then(startGame)
    .catch(errorHandler)
}

function pooling() {
    setInterval(function() {

        fetch(`/api/game?game=${game.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json()
            .then(data => {
                if(res.ok) return data
                else throw data
            })
        })
        .then(updateGameState)
        .catch(errorHandler)

    }, 1000)
}

function errorHandler(err) {
    if(err.error === 'not-pvp') {
        alert('You can only join PVP games!')
        return window.location.replace('/')
    } else if(err.error === 'not-found') {
        alert('Game not found!')
        return window.location.replace('/')
    }
}

function startGame(res) {
    game = res.game
    if(res.player) {
        player = { id: res.player }
    }

    document.getElementById('game-id').textContent = `GameID: ${game.id}`

    // Remove the player list childs
    const optionsList = document.getElementById('game-option-list')
    while (optionsList.firstChild) optionsList.removeChild(optionsList.firstChild)

    const options = Object.keys(game.config)
    for(const opt of options) {
        const gameOptionContainer = document.createElement('div')
        gameOptionContainer.classList.add('game-option')
        if(player) gameOptionContainer.classList.add('option')

        gameOptionContainer.id = opt
        gameOptionContainer.addEventListener('click', e => {
            selectOption(opt)
            return false
        })

        const gameOptionName = document.createElement('p')
        gameOptionName.textContent = toTitle(opt)

        gameOptionContainer.appendChild(gameOptionName)
        optionsList.appendChild(gameOptionContainer)
    }

    computerPlayNext()
}

function computerPlayNext() {
    if(gameMode !== 'cvc') return

    const options = Object.keys(game.config)
    setTimeout(() => {
        const index = Math.floor( Math.random() * options.length )
        selectOption(options[index], game.players[0].id)
    }, 1500)
}

function updatePlayersText(game) {
    let playersText = ''
    const playerListContainer = document.getElementById('player-name-list')
    while (playerListContainer.firstChild) playerListContainer.removeChild(playerListContainer.firstChild)
    
    for(const pl of game.players) {

        const playerResult = game.result.find(x => x.id === pl.id)
        const points = playerResult ? playerResult.points : 0
        const playerText = `Player ${pl.id} (${points})`

        const playerElement = document.createElement('p')
        if(player && player.id === pl.id) playerElement.classList.add('mine')
        playerElement.textContent = playerText

        playerListContainer.appendChild(playerElement)

    }
}

function updateGameState(currentGameState) {
    // If the players amount has changed
    if(game.players.length !== currentGameState.players.length) {
        updatePlayersText(currentGameState)
    }

    // If a round ended
    if(currentGameState.round !== game.round) {
        if(player) {
            // Find if you won any points
            const yourData = currentGameState.lastRound.find(x => x.id == player.id)
            
            if(yourData.points > 0) {
                pointsSpan.textContent = `You won ${yourData.points} POINT${yourData.points != 1 ? 'S': ''}`
                endRoundModal.classList.add('win')
            } else {
                pointsSpan.textContent = 'No points this round'
                endRoundModal.classList.add('lose')
            }
        } else {
            pointsSpan.textContent = ''
        }

        endRoundModal.classList.remove('hide')

        // Remove the player list childs
        const playerList = document.getElementById('player-list')
        while (playerList.firstChild) playerList.removeChild(playerList.firstChild)

        // Recreate the player list
        for(const data of currentGameState.result) {
            const lastRoundPlayer = currentGameState.lastRound.find(x => x.id === data.id)
            const playerItem = document.createElement('div')
            playerItem.classList.add('player-item')
            const playerName = document.createElement('p')
            playerName.classList.add('name')
            playerName.textContent = `Player ${data.id}`
            const playerPoints = document.createElement('p')
            playerPoints.classList.add('points')
            playerPoints.textContent = `${data.points} point${data.points != 1 ? 's' : ''} ${lastRoundPlayer.points > 0 ? `(+${lastRoundPlayer.points})` : ''}`
            const playerOption = document.createElement('p')
            playerOption.classList.add('points')
            playerOption.textContent = `${toTitle(lastRoundPlayer.option)}`
            
            playerItem.appendChild(playerName)
            playerItem.appendChild(playerPoints)
            playerItem.appendChild(playerOption)
            playerList.appendChild(playerItem)
        }

        updatePlayersText(currentGameState)
        setTimeout(restartGame, 3000)
    }

    game = currentGameState
}

function restartGame() {
    endRoundModal.classList.add('hide')
    endRoundModal.classList.remove('win')
    endRoundModal.classList.remove('lose')

    const docs = document.getElementsByClassName("option")
    for (let i = 0; i < docs.length; i++) {
        docs[i].classList.remove('not-selected')
        docs[i].classList.remove('selected')
    }

    computerPlayNext()
}

function selectOption(option, playerId) {
    if(gameMode !== 'cvc') {

        const docs = document.getElementsByClassName("option")
        for (let i = 0; i < docs.length; i++) {
            docs[i].classList.add('not-selected')
        }
        const removeDoc = document.getElementById(option)
        removeDoc.classList.remove('not-selected')
        removeDoc.classList.add('selected')

    }

    if(!playerId) playerId = player.id
    
    fetch('/api/game/option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option, game: game.id, player: playerId })
    })
    .then(res => res.json())
    .then(updateGameState)
    .catch(errorHandler)
}

function toTitle(str) {
    str = str.replace(/\_/g, ' ')
    const first = str.charAt(0).toUpperCase()
    return first + str.substring(1)
}

window.addEventListener("beforeunload", function (event) {
    fetch('/api/game/leave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game: game.id, player: player.id })
    })
})